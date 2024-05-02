def deploy() {
    def activeEnv = sh(returnStdout: true, script: "docker ps --filter \"name=gitpulse\" --format \"{{.Names}}\" | awk -F'-' '{print \$NF}'").trim()
    def newEnv = activeEnv == 'blue' ? 'green' : 'blue'

    log "Starting the new environment: ${newEnv}"
    sh "docker-compose -f ${env.PROJECT_DIR}/${env.DOCKER_COMPOSE_FILE} up -d --no-deps --force-recreate --scale gitpulse-${newEnv}=1"

    log "Waiting for the new environment to be ready"
    sh "docker run --rm --network your-network-name your-image-name healthcheck --start-period=30s --interval=5s --timeout=5s --retries=3 http://gitpulse-${newEnv}:4000/health"

    log "Switching traffic to the new environment: ${newEnv}"
    // Update your load balancer or proxy configuration to route traffic to the new environment

    if (activeEnv) {
        log "Stopping and removing the old environment: ${activeEnv}"
        sh "docker-compose -f ${env.PROJECT_DIR}/${env.DOCKER_COMPOSE_FILE} stop gitpulse-${activeEnv}"
        sh "docker-compose -f ${env.PROJECT_DIR}/${env.DOCKER_COMPOSE_FILE} rm -f gitpulse-${activeEnv}"
    } else {
        log "No active environment found. Skipping stopping and removing the old environment."
    }
}

def log(message) {
    echo "[${new Date().format('yyyy-MM-dd HH:mm:ss')}] ${message}"
}

return this