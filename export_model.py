#python -m venv venv
#venv\Scripts\activate
#.\venv\Scripts\Activate.ps1
#pip3 install -r requirements.txt      
import pandas as pd
import joblib
import json
import os

# Load the pre-trained model from ml_backend folder
model_path = os.path.join('ml_backend', 'lead_model.pkl')
model = joblib.load(model_path)

# Load data only to get feature names for preprocessing
DATA_PATH = os.path.join('small file.csv')
df = pd.read_csv(DATA_PATH)
X = df.drop(['Converted', 'Name', 'Email', 'Website'], axis=1)
X = pd.get_dummies(X)
y = df['Converted']

print(f"Loaded pre-trained model with accuracy: {model.score(X, y):.3f}")

# Extract tree rules as JavaScript
def extract_tree_rules(tree, feature_names):
    """Extract decision tree rules and convert to JavaScript"""
    tree_ = tree.tree_
    feature_name = [
        feature_names[i] if i != -2 else "undefined!"
        for i in tree_.feature
    ]
    
    def recurse(node, depth=0):
        indent = "  " * depth
        if tree_.feature[node] != -2:
            name = feature_name[node]
            threshold = tree_.threshold[node]
            return f"{indent}if (features['{name}'] <= {threshold}) {{\n" + \
                   recurse(tree_.children_left[node], depth + 1) + \
                   f"{indent}}} else {{\n" + \
                   recurse(tree_.children_right[node], depth + 1) + \
                   f"{indent}}}\n"
        else:
            # Leaf node - return probability
            value = tree_.value[node][0]
            prob = value[1] / (value[0] + value[1]) if (value[0] + value[1]) > 0 else 0
            return f"{indent}return {prob:.6f};\n"
    
    return recurse(0)

# Generate JavaScript code for Random Forest
js_code = """
// Auto-generated Random Forest model from scikit-learn
// Lead Intent Scoring Model

// Feature names
const MODEL_FEATURES = """ + json.dumps(list(X.columns)) + """;

// Individual tree predictions
const TREE_PREDICTIONS = [
"""

# Export each tree in the forest
for i, tree in enumerate(model.estimators_):
    js_code += f"  // Tree {i + 1}\n"
    js_code += f"  function tree_{i}(features) {{\n"
    js_code += extract_tree_rules(tree, X.columns)
    js_code += f"  }},\n"

js_code += """];

// Helper function to preprocess input data
function preprocessLeadData(lead) {
    const features = {};
    
    // Initialize all features to 0
    MODEL_FEATURES.forEach(feature => {
        features[feature] = 0;
    });
    
    // Map input fields to model features
    // Title mapping
    if (lead.title || lead.Title) {
        const title = lead.title || lead.Title;
        const titleKey = `Title_${title}`;
        if (MODEL_FEATURES.includes(titleKey)) {
            features[titleKey] = 1;
        }
    }
    
    // Industry mapping  
    if (lead.industry || lead.Industry) {
        const industry = lead.industry || lead.Industry;
        const industryKey = `Industry_${industry}`;
        if (MODEL_FEATURES.includes(industryKey)) {
            features[industryKey] = 1;
        }
    }
    
    // Company Size mapping
    if (lead.companySize || lead['Company Size']) {
        const size = lead.companySize || lead['Company Size'];
        const sizeKey = `Company Size_${size}`;
        if (MODEL_FEATURES.includes(sizeKey)) {
            features[sizeKey] = 1;
        }
    }
    
    // Numerical features
    features['Page Views'] = parseFloat(lead.pageViews || lead['Page Views']) || 0;
    features['Downloads'] = parseFloat(lead.downloads || lead['Downloads']) || 0;
    features['Webinar Attended'] = parseInt(lead.webinarAttended || lead['Webinar Attended']) || 0;
    
    return features;
}

// Main prediction function (Random Forest)
function predictLeadScore(lead) {
    try {
        const features = preprocessLeadData(lead);
        
        // Get predictions from all trees
        let totalScore = 0;
        for (let i = 0; i < TREE_PREDICTIONS.length; i++) {
            totalScore += TREE_PREDICTIONS[i](features);
        }
        
        // Average the predictions (Random Forest)
        const score = totalScore / TREE_PREDICTIONS.length;
        
        return {
            score: score,
            explanation: [
                { feature: 'Page Views', impact: features['Page Views'] > 10 ? 0.2 : (features['Page Views'] > 5 ? 0.1 : 0) },
                { feature: 'Downloads', impact: features['Downloads'] > 2 ? 0.2 : (features['Downloads'] > 0 ? 0.1 : 0) },
                { feature: 'Webinar Attended', impact: features['Webinar Attended'] ? 0.15 : 0 },
                { feature: 'Company Size', impact: (lead.companySize === 'Enterprise' || lead['Company Size'] === 'Enterprise') ? 0.1 : ((lead.companySize === 'Mid-Market' || lead['Company Size'] === 'Mid-Market') ? 0.05 : 0) },
                { feature: 'Industry', impact: ['Technology', 'Finance', 'Healthcare'].includes(lead.industry || lead.Industry) ? 0.1 : 0 }
            ]
        };
    } catch (error) {
        console.error('Error in ML prediction:', error);
        // Fallback to rule-based scoring
        return generateFallbackScore(lead);
    }
}

// Fallback scoring function (from app.js)
function generateFallbackScore(lead) {
    let score = 0.3; // Base score
    
    // Score based on engagement
    const pageViews = parseInt(lead.pageViews || lead['Page Views']) || 0;
    const downloads = parseInt(lead.downloads || lead['Downloads']) || 0;
    const webinarAttended = !!(lead.webinarAttended || lead['Webinar Attended']);
    
    if (pageViews > 10) score += 0.2;
    else if (pageViews > 5) score += 0.1;
    
    if (downloads > 2) score += 0.2;
    else if (downloads > 0) score += 0.1;
    
    if (webinarAttended) score += 0.15;
    
    // Score based on company attributes
    const companySize = lead.companySize || lead['Company Size'] || '';
    if (companySize === 'Enterprise') score += 0.1;
    else if (companySize === 'Mid-Market') score += 0.05;
    
    // Industry scoring
    const industry = lead.industry || lead.Industry || '';
    const highValueIndustries = ['Technology', 'Finance', 'Healthcare'];
    if (highValueIndustries.includes(industry)) score += 0.1;
    
    // Title scoring
    const title = lead.title || lead.Title || '';
    const seniorTitles = ['CEO', 'CTO', 'VP', 'Director', 'Manager'];
    if (seniorTitles.some(t => title.includes(t))) score += 0.1;
    
    // Cap at 1.0
    score = Math.min(score, 1.0);
    
    return {
        score: score,
        explanation: [
            { feature: 'Page Views', impact: pageViews > 5 ? 0.1 : 0 },
            { feature: 'Downloads', impact: downloads > 0 ? 0.1 : 0 },
            { feature: 'Webinar Attendance', impact: webinarAttended ? 0.15 : 0 },
            { feature: 'Company Size', impact: companySize === 'Enterprise' ? 0.1 : 0.05 },
            { feature: 'Industry', impact: highValueIndustries.includes(industry) ? 0.1 : 0 }
        ]
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { predictLeadScore, preprocessLeadData, MODEL_FEATURES, generateFallbackScore };
}
"""

# Save the JavaScript model
with open('ml_model.js', 'w') as f:
    f.write(js_code)

print("Model exported successfully!")
print(f"Feature count: {len(X.columns)}")
print(f"Number of trees: {len(model.estimators_)}")
print(f"JavaScript model saved to: ml_model.js")
print(f"Model accuracy on training data: {model.score(X, y):.3f}")
