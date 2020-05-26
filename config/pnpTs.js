const { resolveModuleName } = require("ts-pnp/index");

export const constresolveModuleName = (
  typescript,
  moduleName,
  containingFile,
  compilerOptions,
  resolutionHost,
) => {
  return resolveModuleName(
    moduleName,
    containingFile,
    compilerOptions,
    resolutionHost,
    typescript.resolveModuleName,
  );
};

export const resolveTypeReferenceDirective = (
  typescript,
  moduleName,
  containingFile,
  compilerOptions,
  resolutionHost,
) => {
  return resolveModuleName(
    moduleName,
    containingFile,
    compilerOptions,
    resolutionHost,
    typescript.resolveTypeReferenceDirective,
  );
};
