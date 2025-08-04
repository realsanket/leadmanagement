"""
Combined Model Training and Export Script

This script handles both:
1. Training a Random Forest classifier on lead conversion data
2. Exporting the trained model to JavaScript for client-side use

This enables GitHub Pages deployment by eliminating the need for a Python backend.

Usage:
    python train_and_export_model.py
"""

import pandas as pd
import joblib
import json
import os
import numpy as np
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report

# =====================================================
# CONFIGURATION
# =====================================================

# File paths
DATA_PATH = 'small file.csv'
MODEL_PATH = os.path.join('trained_model', 'lead_model.pkl')
JS_MODEL_PATH = 'ml_model.js'
METRICS_PATH = os.path.join('trained_model', 'model_metrics.txt')

# Model hyperparameters
MODEL_CONFIG = {
    'n_estimators': 100,      # Number of trees in the forest
    'random_state': 42,       # For reproducible results
    'max_depth': None,        # Maximum depth of trees (None = unlimited)
    'min_samples_split': 2,   # Minimum samples required to split a node
    'min_samples_leaf': 1     # Minimum samples required at a leaf node
}

def load_and_prepare_data():
    """
    Load and preprocess the training data
    
    Returns:
        tuple: (X, y, df) where X is features, y is target, df is original dataframe
    """
    print("Loading training data...")
    
    # Load historical lead data
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df)} records from {DATA_PATH}")
    
    # Feature Selection: Drop non-feature columns
    X = df.drop(['Converted', 'Name', 'Email', 'Website'], axis=1)
    
    # Convert categorical variables to dummy variables
    X = pd.get_dummies(X)
    
    # Target Variable: Converted (0 or 1)
    y = df['Converted']
    
    # Data validation
    print(f"Features shape: {X.shape}")
    print(f"Target shape: {y.shape}")
    print(f"Missing values in features: {X.isnull().sum().sum()}")
    print(f"Missing values in target: {y.isnull().sum()}")
    print(f"Number of features after encoding: {len(X.columns)}")
    
    return X, y, df

def train_model(X, y):
    """
    Train the Random Forest model with cross-validation
    
    Args:
        X: Feature matrix
        y: Target vector
        
    Returns:
        tuple: (trained_model, training_metrics)
    """
    print("\nTraining Random Forest classifier...")
    
    # Split data for final evaluation
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    print(f"Training target distribution: {y_train.value_counts().to_dict()}")
    print(f"Test target distribution: {y_test.value_counts().to_dict()}")
    
    # Initialize model
    model = RandomForestClassifier(**MODEL_CONFIG)
    
    # Train model
    model.fit(X_train, y_train)
    
    # =====================================================
    # MODEL EVALUATION
    # =====================================================
    
    # Predictions
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)
    
    # Calculate metrics
    train_accuracy = accuracy_score(y_train, y_train_pred)
    test_accuracy = accuracy_score(y_test, y_test_pred)
    
    # Cross-validation for more robust evaluation
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
    
    # Feature importance (top 10)
    feature_importance = dict(zip(X.columns, model.feature_importances_))
    top_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:10]
    
    # Classification report
    test_report = classification_report(y_test, y_test_pred, output_dict=True)
    
    metrics = {
        'train_accuracy': train_accuracy,
        'test_accuracy': test_accuracy,
        'cv_mean_accuracy': cv_scores.mean(),
        'cv_std_accuracy': cv_scores.std(),
        'feature_importance': feature_importance,
        'top_features': top_features,
        'classification_report': test_report,
        'training_date': datetime.now().isoformat(),
        'model_config': MODEL_CONFIG,
        'data_size': len(X),
        'num_features': X.shape[1]
    }
    
    return model, metrics

def save_model_and_metrics(model, metrics):
    """
    Save the trained model and training metrics
    
    Args:
        model: Trained scikit-learn model
        metrics: Dictionary containing training metrics
    """
    print("\nSaving model and metrics...")
    
    # Create trained_model directory if it doesn't exist
    os.makedirs('trained_model', exist_ok=True)
    
    # Save model
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")
    
    # Save metrics to text file for easy reading
    with open(METRICS_PATH, 'w') as f:
        f.write("LEAD CONVERSION MODEL TRAINING METRICS\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Training Date: {metrics['training_date']}\n")
        f.write(f"Data Size: {metrics['data_size']} records\n")
        f.write(f"Number of Features: {metrics['num_features']}\n\n")
        
        f.write("MODEL CONFIGURATION:\n")
        for key, value in metrics['model_config'].items():
            f.write(f"  {key}: {value}\n")
        f.write("\n")
        
        f.write("PERFORMANCE METRICS:\n")
        f.write(f"  Training Accuracy: {metrics['train_accuracy']:.4f}\n")
        f.write(f"  Test Accuracy: {metrics['test_accuracy']:.4f}\n")
        f.write(f"  Cross-Validation Accuracy (mean ± std): {metrics['cv_mean_accuracy']:.4f} ± {metrics['cv_std_accuracy']:.4f}\n\n")
        
        f.write("CLASSIFICATION REPORT:\n")
        report = metrics['classification_report']
        f.write(f"  Precision (Class 0): {report['0']['precision']:.4f}\n")
        f.write(f"  Recall (Class 0): {report['0']['recall']:.4f}\n")
        f.write(f"  F1-Score (Class 0): {report['0']['f1-score']:.4f}\n")
        f.write(f"  Precision (Class 1): {report['1']['precision']:.4f}\n")
        f.write(f"  Recall (Class 1): {report['1']['recall']:.4f}\n")
        f.write(f"  F1-Score (Class 1): {report['1']['f1-score']:.4f}\n\n")
        
        f.write("TOP 10 MOST IMPORTANT FEATURES:\n")
        for i, (feature, importance) in enumerate(metrics['top_features'], 1):
            f.write(f"  {i:2d}. {feature}: {importance:.4f}\n")
    
    print(f"Metrics saved to: {METRICS_PATH}")

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

def export_to_javascript(model, X):
    """
    Export the trained model to JavaScript for client-side use
    
    Args:
        model: Trained scikit-learn model
        X: Feature matrix (for feature names)
    """
    print("\nExporting model to JavaScript...")
    
    # Generate JavaScript code for Random Forest
    js_code = f"""
// Auto-generated Random Forest model from scikit-learn
// Lead Intent Scoring Model
// Generated on: {datetime.now().isoformat()}

// Feature names
const MODEL_FEATURES = {json.dumps(list(X.columns))};

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
    with open(JS_MODEL_PATH, 'w') as f:
        f.write(js_code)
    
    print(f"JavaScript model exported to: {JS_MODEL_PATH}")

def print_training_summary(metrics):
    """
    Print a summary of training results to console
    
    Args:
        metrics: Dictionary containing training metrics
    """
    print("\n" + "=" * 50)
    print("TRAINING COMPLETED SUCCESSFULLY")
    print("=" * 50)
    print(f"Model Accuracy: {metrics['test_accuracy']:.4f}")
    print(f"Cross-Validation Score: {metrics['cv_mean_accuracy']:.4f} ± {metrics['cv_std_accuracy']:.4f}")
    print(f"Number of Features: {metrics['num_features']}")
    print("\nTop 5 Most Important Features:")
    for i, (feature, importance) in enumerate(metrics['top_features'][:5], 1):
        print(f"  {i}. {feature}: {importance:.4f}")
    print("=" * 50)

def main():
    """
    Main training and export pipeline
    """
    try:
        print("🚀 Starting model training and export process...")
        
        # Step 1: Load and prepare data
        X, y, df = load_and_prepare_data()
        
        # Step 2: Train model
        model, metrics = train_model(X, y)
        
        # Step 3: Save model and metrics
        save_model_and_metrics(model, metrics)
        
        # Step 4: Export to JavaScript
        export_to_javascript(model, X)
        
        # Step 5: Print summary
        print_training_summary(metrics)
        
        print("\n✅ Model training and export completed successfully!")
        print(f"📦 Python model saved to: {MODEL_PATH}")
        print(f"🌐 JavaScript model saved to: {JS_MODEL_PATH}")
        print(f"📊 Metrics saved to: {METRICS_PATH}")
        print(f"🎯 Model accuracy: {metrics['test_accuracy']:.3f}")
        print(f"🌳 Number of trees: {len(model.estimators_)}")
        print(f"📈 Feature count: {metrics['num_features']}")
        
        print("\n🎉 Your app is now ready for GitHub Pages deployment!")
        print("   The JavaScript model will work client-side without any backend.")
        
    except Exception as e:
        print(f"\n❌ Training failed with error: {str(e)}")
        raise

if __name__ == '__main__':
    main()
