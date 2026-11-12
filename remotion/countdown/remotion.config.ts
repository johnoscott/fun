import { Config } from "@remotion/cli/config";

// Use the shared system Chromium; Remotion's own browser download is blocked here.
Config.setBrowserExecutable("/usr/bin/chromium");
Config.setChromiumDisableWebSecurity(false);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
