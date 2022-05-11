[![units-test](https://github.com/nh758/ab-install-action/actions/workflows/test.yml/badge.svg)](https://github.com/nh758/ab-install-action/actions/workflows/test.yml) [![CodeQL](https://github.com/nh758/ab-install-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/nh758/ab-install-action/actions/workflows/codeql-analysis.yml) [![Check dist/](https://github.com/nh758/ab-install-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/nh758/ab-install-action/actions/workflows/check-dist.yml)

# AppBuilder Install Action

Action for GitHub workflows, will perform a AppBuilder production install.

## Use

```yaml
uses: digi-serve/ab-install-action@v1
with:
   stack: ab
```

| input  | default value | Description                          |
| ------ | ------------- | ------------------------------------ |
| stack  | ab            | Stack to install with                |
| folder | AppBuilder    | path to install to                   |
| port   | 80            | port for the ab_platform_web service |
