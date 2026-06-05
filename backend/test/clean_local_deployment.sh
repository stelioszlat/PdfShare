#!/usr/bin/env bash

set +e

MANIFEST_DIR="../kubernetes"
NAMESPACE="default"

echo "===================================================="
echo "🧹 Starting MicroK8s Application Cleanup Pipeline"
echo "===================================================="

if [ -d "$MANIFEST_DIR" ]; then
    echo "🗑️  Deleting resources defined in $MANIFEST_DIR..."
    microk8s kubectl delete -f "$MANIFEST_DIR/" --ignore-not-found=true
else
    echo "⚠️  Manifest directory not found. Falling back to explicit resource deletion..."
fi

echo "🗑️  Purging remaining application deployments & services..."
microk8s kubectl delete deployment pdfshare-deployment -n "$NAMESPACE" --ignore-not-found=true
microk8s kubectl delete deployment cache-instance -n "$NAMESPACE" --ignore-not-found=true
microk8s kubectl delete deployment queue-instance -n "$NAMESPACE" --ignore-not-found=true

microk8s kubectl delete service auth-svc metadata-svc files-svc cache-service queue-service -n "$NAMESPACE" --ignore-not-found=true
microk8s kubectl delete ingress pdfshare-ingress -n "$NAMESPACE" --ignore-not-found=true

echo "🗑️  Removing application configurations and secrets..."
microk8s kubectl delete configmap pdfshare-config -n "$NAMESPACE" --ignore-not-found=true
microk8s kubectl delete secret pdfshare-secret -n "$NAMESPACE" --ignore-not-found=true

echo "⏳ Waiting for pods to terminate completely..."
microk8s kubectl wait --for=delete pod -l role=pdfshare-backend -n "$NAMESPACE" --timeout=30s 2>/dev/null
microk8s kubectl wait --for=delete pod -l app=cache -n "$NAMESPACE" --timeout=30s 2>/dev/null
microk8s kubectl wait --for=delete pod -l app=queue -n "$NAMESPACE" --timeout=30s 2>/dev/null

echo ""
echo "===================================================="
echo "✨ Clean Complete! Current active cluster state:"
echo "===================================================="
microk8s kubectl get all -n "$NAMESPACE"