import { Config } from "@remotion/cli/config";

Config.setBrowserExecutable("/usr/bin/chromium");
Config.setChromiumDisableWebSecurity(false);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
