import { AppConfigService } from './app-config.service';

export function initializeApp(appConfigService: AppConfigService) {
  return () => appConfigService.loadConfig();
}
