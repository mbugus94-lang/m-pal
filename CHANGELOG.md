# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.3] - 2026-03-24

### Changed
- Version bump to 1.0.3 for maintenance release
- Updated devDependencies to latest stable versions:
  - @types/node: ^22.13.13 → ^25.5.0
  - eslint: ^9.23.0 → ^10.1.0
  - jest: ^29.7.0 → ^30.3.0
  - prettier: ^3.3.3 → ^3.5.3
  - ts-jest: ^29.2.6 → ^29.3.0

## [1.0.2] - 2026-03-23

### Changed
- Version bump to 1.0.2 for maintenance release
- General dependency maintenance

## [1.0.1] - 2026-03-22

### Security
- Updated zod from 3.25.76 to 4.3.6 (major version bump with security improvements)

### Added
- Comprehensive TypeScript test suite (6 test files, ~850 lines)
- M-Pesa provider tests
- MTN MoMo provider tests
- Airtel Money provider tests
- Offline queue system tests
- Phone validation & currency formatting tests
- Main SDK integration tests
- Test coverage improved from 0% to ~80%

### Changed
- All dependencies updated to latest stable versions
- axios: 1.7.7 → 1.8.4
- dotenv: 16.4.5 → 17.3.1
- p-queue: 8.0.1 → 9.1.0

## [1.0.0] - 2026-03-21

### Added
- Initial release
- Core functionality implemented
- Basic documentation
- CI/CD workflow configuration
