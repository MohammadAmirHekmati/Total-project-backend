export interface Browser {
  name: string;
  version: string;
  major: string;
}

export interface Engine {
  name: string;
  version: string;
}

export interface Os {
  name: string;
  version: string;
}

export interface Device {
}

export interface Cpu {
  architecture: string;
}

export interface UserAgentParserInterface {
  ua: string;
  browser: Browser;
  engine: Engine;
  os: Os;
  device: Device;
  cpu: Cpu;
}

