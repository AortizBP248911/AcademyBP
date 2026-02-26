import { execSync } from 'child_process'

export function getVersion(): string {
  try {
    // Check if git is available and we are in a git repo
    try {
        execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' })
    } catch {
        return '1.0.0'
    }

    const minorCount = parseInt(execSync('git rev-list --count --grep="^feat" HEAD', { encoding: 'utf-8' }).trim(), 10)
    const patchCount = parseInt(execSync('git rev-list --count --grep="^fix\\|^chore\\|^update\\|^refactor\\|^style\\|^docs" HEAD', { encoding: 'utf-8' }).trim(), 10)
    
    // If counts are NaN (shouldn't happen with valid git output), fallback to 0
    const minor = isNaN(minorCount) ? 0 : minorCount
    const patch = isNaN(patchCount) ? 0 : patchCount

    return `1.${minor}.${patch}`
  } catch (error) {
    console.error('Error calculating version:', error)
    return '1.0.0'
  }
}
