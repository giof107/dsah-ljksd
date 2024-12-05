import Docker from 'dockerode';

export const docker = new Docker({
  socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
  // For Windows users
  // host: process.env.DOCKER_HOST || 'tcp://localhost:2375',
});

export async function validateDockerConnection() {
  try {
    await docker.ping();
    console.log('Docker daemon connected successfully');
    return true;
  } catch (error) {
    console.error('Docker daemon connection failed:', error);
    throw error;
  }
}