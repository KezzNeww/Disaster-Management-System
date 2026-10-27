"""
Model Evaluation and Visualization Module
=========================================

This module performs comprehensive evaluation of the trained Random Forest model:
1. Calculates Accuracy, Precision, Recall, F1-Score (macro, weighted, and per-class).
2. Generates and saves:
   - confusion_matrix.png (Normalized & Raw annotations, publication-quality heatmaps)
   - feature_importance.png (Horizontal bar chart of Gini feature importances)
   - roc_curve.png (Multi-class One-vs-Rest ROC curves with AUC for each class & Macro/Micro average)
   - class_distribution.png (Distribution of classes across Train and Test splits)
   - classification_report.txt (Detailed text report with precision, recall, f1, support)
   - metrics.json (Structured metrics for programmatic consumption)
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from itertools import cycle
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    auc
)
from sklearn.preprocessing import label_binarize

# Set professional visualization aesthetics
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['axes.edgecolor'] = '#CBD5E1'
plt.rcParams['axes.linewidth'] = 0.8


def load_model_and_test_data(base_dir: str):
    """Load model bundle and test set."""
    model_path = os.path.join(base_dir, 'models', 'risk_model.pkl')
    data_dir = os.path.join(base_dir, 'dataset', 'processed')
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}. Run train_model.py first.")
        
    bundle = joblib.load(model_path)
    X_test = np.load(os.path.join(data_dir, 'X_test.npy'))
    y_test = np.load(os.path.join(data_dir, 'y_test.npy'))
    y_train = np.load(os.path.join(data_dir, 'y_train.npy'))
    
    return bundle, X_test, y_test, y_train


def plot_confusion_matrix(y_true, y_pred, target_classes, save_path):
    """Generate high-contrast normalized and count confusion matrix."""
    cm = confusion_matrix(y_true, y_pred)
    cm_norm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    
    fig, ax = plt.subplots(figsize=(8, 6.5), dpi=300)
    
    # Custom annotations combining percentage and sample counts
    annot_labels = np.empty_like(cm, dtype=object)
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            annot_labels[i, j] = f"{cm_norm[i, j]*100:.1f}%\n({cm[i, j]})"
            
    sns.heatmap(
        cm_norm,
        annot=annot_labels,
        fmt='',
        cmap='Blues',
        xticklabels=target_classes,
        yticklabels=target_classes,
        cbar_kws={'label': 'Normalized Prediction Ratio'},
        linewidths=1.2,
        linecolor='#F1F5F9',
        ax=ax
    )
    
    ax.set_title("Random Forest Disaster Risk - Confusion Matrix", fontsize=14, weight='bold', pad=15, color='#0F172A')
    ax.set_xlabel("Predicted Risk Tier", fontsize=12, weight='semibold', labelpad=10, color='#1E293B')
    ax.set_ylabel("True Ground Truth Risk Tier", fontsize=12, weight='semibold', labelpad=10, color='#1E293B')
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[EVAL] Saved Confusion Matrix to: {save_path}")


def plot_feature_importance(feature_names, importances, save_path, top_n=15):
    """Plot sorted horizontal bar chart of top predictor features."""
    indices = np.argsort(importances)[::-1][:top_n]
    sorted_features = [feature_names[i] for i in indices][::-1]
    sorted_scores = [importances[i] for i in indices][::-1]
    
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
    
    # Elegant gradient bar color palette
    colors = plt.cm.viridis(np.linspace(0.3, 0.85, len(sorted_features)))
    bars = ax.barh(sorted_features, sorted_scores, color=colors, edgecolor='#0F172A', height=0.65, alpha=0.9)
    
    # Add numerical labels at the end of each bar
    for bar in bars:
        width = bar.get_width()
        ax.text(width + 0.003, bar.get_y() + bar.get_height()/2, f"{width:.3f}",
                va='center', ha='left', fontsize=9.5, weight='bold', color='#1E293B')
        
    ax.set_title("Random Forest Feature Importance (MDI)", fontsize=14, weight='bold', pad=15, color='#0F172A')
    ax.set_xlabel("Relative Importance Score", fontsize=12, weight='semibold', labelpad=10, color='#1E293B')
    ax.set_ylabel("Environmental & Hazard Features", fontsize=12, weight='semibold', labelpad=10, color='#1E293B')
    ax.set_xlim(0, max(sorted_scores) * 1.15)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[EVAL] Saved Feature Importance to: {save_path}")


def plot_roc_curves(y_true, y_probs, target_classes, save_path):
    """Plot multiclass One-vs-Rest ROC curves with macro/micro AUC."""
    n_classes = len(target_classes)
    y_test_bin = label_binarize(y_true, classes=list(range(n_classes)))
    
    fpr = dict()
    tpr = dict()
    roc_auc = dict()
    
    for i in range(n_classes):
        fpr[i], tpr[i], _ = roc_curve(y_test_bin[:, i], y_probs[:, i])
        roc_auc[i] = auc(fpr[i], tpr[i])
        
    # Micro-average ROC curve
    fpr["micro"], tpr["micro"], _ = roc_curve(y_test_bin.ravel(), y_probs.ravel())
    roc_auc["micro"] = auc(fpr["micro"], tpr["micro"])
    
    # Macro-average ROC curve
    all_fpr = np.unique(np.concatenate([fpr[i] for i in range(n_classes)]))
    mean_tpr = np.zeros_like(all_fpr)
    for i in range(n_classes):
        mean_tpr += np.interp(all_fpr, fpr[i], tpr[i])
    mean_tpr /= n_classes
    fpr["macro"] = all_fpr
    tpr["macro"] = mean_tpr
    roc_auc["macro"] = auc(fpr["macro"], tpr["macro"])
    
    fig, ax = plt.subplots(figsize=(8.5, 7), dpi=300)
    
    # Plot micro and macro averages
    ax.plot(fpr["micro"], tpr["micro"],
            label=f'Micro-average ROC (AUC = {roc_auc["micro"]:.3f})',
            color='#D97706', linestyle=':', linewidth=2.5)
            
    ax.plot(fpr["macro"], tpr["macro"],
            label=f'Macro-average ROC (AUC = {roc_auc["macro"]:.3f})',
            color='#4F46E5', linestyle=':', linewidth=2.5)
            
    # Class-specific colors
    colors = ['#10B981', '#3B82F6', '#EC4899', '#EF4444']
    for i, color in zip(range(n_classes), colors):
        ax.plot(fpr[i], tpr[i], color=color, linewidth=2.0,
                label=f'Class: {target_classes[i]} (AUC = {roc_auc[i]:.3f})')
                
    ax.plot([0, 1], [0, 1], 'k--', linewidth=1.2, alpha=0.5, label='Random Chance Baseline')
    
    ax.set_xlim([0.0, 1.0])
    ax.set_ylim([0.0, 1.05])
    ax.set_xlabel('False Positive Rate (1 - Specificity)', fontsize=12, weight='semibold', labelpad=10)
    ax.set_ylabel('True Positive Rate (Sensitivity)', fontsize=12, weight='semibold', labelpad=10)
    ax.set_title('Receiver Operating Characteristic (ROC) - Multi-Class OvR', fontsize=14, weight='bold', pad=15)
    ax.legend(loc="lower right", frameon=True, fontsize=10, framealpha=0.9)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[EVAL] Saved ROC Curve to: {save_path}")
    
    return roc_auc


def plot_class_distribution(y_train, y_test, target_classes, save_path):
    """Plot target class distribution in Train vs Test splits."""
    train_counts = pd.Series(y_train).value_counts().sort_index()
    test_counts = pd.Series(y_test).value_counts().sort_index()
    
    x = np.arange(len(target_classes))
    width = 0.35
    
    fig, ax = plt.subplots(figsize=(8, 5.5), dpi=300)
    
    rects1 = ax.bar(x - width/2, [train_counts.get(i, 0) for i in range(len(target_classes))],
                    width, label='Training Set (80%)', color='#2563EB', alpha=0.9, edgecolor='#1E3A8A')
    rects2 = ax.bar(x + width/2, [test_counts.get(i, 0) for i in range(len(target_classes))],
                    width, label='Testing Set (20%)', color='#10B981', alpha=0.9, edgecolor='#065F46')
                    
    for rect in list(rects1) + list(rects2):
        height = rect.get_height()
        ax.annotate(f'{height}',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3), textcoords="offset points",
                    ha='center', va='bottom', fontsize=9, weight='bold')
                    
    ax.set_title('Disaster Risk Class Distribution (Train vs Test)', fontsize=14, weight='bold', pad=15)
    ax.set_ylabel('Number of Samples', fontsize=12, weight='semibold')
    ax.set_xticks(x)
    ax.set_xticklabels(target_classes, fontsize=11, weight='semibold')
    ax.legend(frameon=True, fontsize=10)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[EVAL] Saved Class Distribution plot to: {save_path}")


def evaluate(base_dir: str):
    """Run complete evaluation and generate reports and visual assets."""
    eval_dir = os.path.join(base_dir, 'evaluation')
    os.makedirs(eval_dir, exist_ok=True)
    
    bundle, X_test, y_test, y_train = load_model_and_test_data(base_dir)
    model = bundle['model']
    target_classes = bundle['target_classes']
    feature_names = bundle['feature_names']
    
    print("\n" + "="*60)
    print("RUNNING MODEL EVALUATION ON INDEPENDENT TEST SPLIT")
    print("="*60)
    
    # Predictions
    y_pred = model.predict(X_test)
    y_probs = model.predict_proba(X_test)
    
    # Calculate Core Metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision_macro = precision_score(y_test, y_pred, average='macro', zero_division=0)
    recall_macro = recall_score(y_test, y_pred, average='macro', zero_division=0)
    f1_macro = f1_score(y_test, y_pred, average='macro', zero_division=0)
    
    precision_weighted = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall_weighted = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1_weighted = f1_score(y_test, y_pred, average='weighted', zero_division=0)
    
    print(f"Test Accuracy           : {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"Precision (Macro)       : {precision_macro:.4f}")
    print(f"Recall (Macro)          : {recall_macro:.4f}")
    print(f"F1 Score (Macro)        : {f1_macro:.4f}")
    print(f"F1 Score (Weighted)     : {f1_weighted:.4f}")
    
    # Classification Report
    clf_report_str = classification_report(
        y_test,
        y_pred,
        target_names=target_classes,
        digits=4
    )
    clf_report_dict = classification_report(
        y_test,
        y_pred,
        target_names=target_classes,
        output_dict=True
    )
    
    print("\nClassification Report:\n" + clf_report_str)
    
    # Save classification report text file
    report_file = os.path.join(eval_dir, 'classification_report.txt')
    with open(report_file, 'w') as f:
        f.write("DISASTER RISK PREDICTION - MODEL CLASSIFICATION REPORT\n")
        f.write("=====================================================\n\n")
        f.write(f"Algorithm       : RandomForestClassifier\n")
        f.write(f"Test Records    : {len(y_test)}\n")
        f.write(f"Accuracy        : {accuracy:.4f} ({accuracy*100:.2f}%)\n")
        f.write(f"Precision (Macro): {precision_macro:.4f}\n")
        f.write(f"Recall (Macro)   : {recall_macro:.4f}\n")
        f.write(f"F1 Score (Macro) : {f1_macro:.4f}\n\n")
        f.write(clf_report_str)
    print(f"[EVAL] Saved text report to: {report_file}")
    
    # 1. Visualizations
    cm_path = os.path.join(eval_dir, 'confusion_matrix.png')
    plot_confusion_matrix(y_test, y_pred, target_classes, cm_path)
    
    feat_path = os.path.join(eval_dir, 'feature_importance.png')
    plot_feature_importance(feature_names, model.feature_importances_, feat_path)
    
    roc_path = os.path.join(eval_dir, 'roc_curve.png')
    roc_aucs = plot_roc_curves(y_test, y_probs, target_classes, roc_path)
    
    dist_path = os.path.join(eval_dir, 'class_distribution.png')
    plot_class_distribution(y_train, y_test, target_classes, dist_path)
    
    # 2. Save structured metrics JSON
    metrics_path = os.path.join(eval_dir, 'metrics.json')
    metrics_payload = {
        'model_name': 'RandomForestClassifier',
        'test_set_size': int(len(y_test)),
        'accuracy': round(float(accuracy), 4),
        'precision_macro': round(float(precision_macro), 4),
        'recall_macro': round(float(recall_macro), 4),
        'f1_score_macro': round(float(f1_macro), 4),
        'precision_weighted': round(float(precision_weighted), 4),
        'recall_weighted': round(float(recall_weighted), 4),
        'f1_score_weighted': round(float(f1_weighted), 4),
        'roc_auc_macro': round(float(roc_aucs['macro']), 4),
        'roc_auc_micro': round(float(roc_aucs['micro']), 4),
        'per_class_auc': {target_classes[i]: round(float(roc_aucs[i]), 4) for i in range(len(target_classes))},
        'per_class_metrics': {
            cls: {
                'precision': round(float(clf_report_dict[cls]['precision']), 4),
                'recall': round(float(clf_report_dict[cls]['recall']), 4),
                'f1_score': round(float(clf_report_dict[cls]['f1-score']), 4),
                'support': int(clf_report_dict[cls]['support'])
            }
            for cls in target_classes
        }
    }
    with open(metrics_path, 'w') as f:
        json.dump(metrics_payload, f, indent=4)
    print(f"[EVAL] Saved structured metrics to: {metrics_path}")


if __name__ == '__main__':
    base = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    evaluate(base)
