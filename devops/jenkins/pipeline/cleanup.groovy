def cleanup() {
    log "Removing unused Docker images"
    sh "docker image prune -f"
}

def log(message) {
    echo "[${new Date().format('yyyy-MM-dd HH:mm:ss')}] ${message}"
}

return this