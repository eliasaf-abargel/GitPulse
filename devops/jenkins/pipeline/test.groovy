def test() {
    log "Running tests..."
    sh "docker run --rm your-image-name npm test"
}

def log(message) {
    echo "[${new Date().format('yyyy-MM-dd HH:mm:ss')}] ${message}"
}

return this