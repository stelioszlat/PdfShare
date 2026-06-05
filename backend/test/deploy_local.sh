#!/usr/bin/env bash

set -e

DEPLOYMENT_DIR="../kubernetes"
CONFIGS_MANIFEST="$DEPLOYMENT_DIR/pdfshare-config-map.yaml"
DEPLOYMENTS_MENIFEST="$DEPLOYMENT_DIR/pdfshare-deployment.yaml"
QUEUE_MANIFEST="$DEPLOYMENT_DIR/pdfshare-queue-deployment.yaml"
CACHE_MANIFEST="$DEPLOYMENT_DIR/pdfshare-cache-deployment.yaml"
INGRESS_MANIFEST="$DEPLOYMENT_DIR/pdfshare-ingress.yaml"

DEPLOYMENTS=("cache-instance" "queue-instance" "pdfshare-apps")
NAMESPACE="default"
TIMEOUT_SECONDS=180

echo "===================================================="
echo "☸️  Starting MicroK8s Complete Application Deployment"
echo "===================================================="

echo "🔍 Checking MicroK8s status..."
if ! sudo microk8s status > /dev/null 2>&1; then
    echo "❌ Error: MicroK8s is not running or ready. Trying to run 'microk8s start' first."
    sudo microk8s start
    exit 1
fi

if ! sudo microk8s status > /dev/null 2>&1; then
    echo "❌ Error: MicroK8s failed to start or is still not ready after 'microk8s start' command. Please check 'microk8s status' for more details."
    exit 1
fi

echo ""
echo "📦 1/5 Applying Core Configurations & Secrets..."
sudo microk8s kubectl apply -f "$CONFIGS_MANIFEST"

echo ""
echo "📦 2/5 Launching Microservices Pods..."
sudo microk8s kubectl apply -f "$DEPLOYMENTS_MENIFEST"

echo ""
echo "📦 3/5 Launching Queue Pods..."
sudo microk8s kubectl apply -f "$QUEUE_MANIFEST"

echo ""
echo "📦 4/5 Launching Cache Pods..."
sudo microk8s kubectl apply -f "$CACHE_MANIFEST"

echo ""
echo "📦 5/5 Setting up Local NGINX Ingress Routing..."
sudo microk8s kubectl apply -f "$INGRESS_MANIFEST"

echo ""
echo "===================================================="
echo "⏳ Verifying Deployment Rollouts & Pod Statuses"
echo "===================================================="

set +e

for DEPLOY in "${DEPLOYMENTS[@]}"; do
    echo "🔄 Waiting for deployment '$DEPLOY' to achieve ready state..."
    
    sudo microk8s kubectl rollout status deployment/"$DEPLOY" \
        --namespace="$NAMESPACE" \
        --timeout="${TIMEOUT_SECONDS}s"
    
    if [ $? -ne 0 ]; then
        echo "❌ Error: Deployment '$DEPLOY' failed to roll out within $TIMEOUT_SECONDS seconds."
        echo "📋 Printing fault logs for troubleshooting:"
        sudo microk8s kubectl logs deployment/"$DEPLOY" --tail=20
        exit 1
    fi
done

echo ""
echo "🔍 Checking individual Pod statuses..."
RETRY_COUNT=0
MAX_RETRIES=6
ALL_PODS_READY=false

while [ "$RETRY_COUNT" -lt "$MAX_RETRIES" ]; do
    # Look for any pods that are NOT marked as Running or Completed
    NON_RUNNING_PODS=$(sudo microk8s kubectl get pods -n "$NAMESPACE" --no-headers | grep -v -E "Running|Completed" || true)
    
    if [ -z "$NON_RUNNING_PODS" ]; then
        ALL_PODS_READY=true
        break
    fi
    
    echo "⚠️  Some pods are still setting up or stabilizing. Re-checking in 10 seconds..."
    sleep 10
    ((RETRY_COUNT++))
done

if [ "$ALL_PODS_READY" = false ]; then
    echo "❌ Warning: One or more pods failed to achieve a healthy state:"
    sudo microk8s kubectl get pods -n "$NAMESPACE"
    exit 1
fi

echo ""
echo "===================================================="
echo "🎉 SUCCESS: Application Deployed Successfully!"
echo "===================================================="
echo "📋 Active Cluster Status Overview:"
echo "----------------------------------------------------"
sudo microk8s kubectl get pods,svc,ingress -n "$NAMESPACE"

echo ""
echo "🚀 You can now access your application at:"
echo "   👉 Auth:     http://localhost/api/auth"
echo "   👉 Metadata: http://localhost/api/metadata"
echo "   👉 Files:    http://localhost/api/files"
echo "===================================================="