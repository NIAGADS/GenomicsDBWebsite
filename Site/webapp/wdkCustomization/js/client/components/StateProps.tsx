import { get } from 'lodash';
import { RootState } from 'wdk-client/Core/State/Types';
import { GlobalData } from 'wdk-client/StoreModules/GlobalData';

export const wdkModelBuildNumber = (state: RootState): string => get(state, 'globalData.config.buildNumber', "");
export const isGuest = (state: RootState): boolean => get(state, 'globalData.user.isGuest', true);
export const webAppUrl = (state: RootState): string => get(state, 'globalData.siteConfig.webAppUrl', "");

type WdkStateProps = {
    webAppUrl?: ReturnType<typeof webAppUrl>;
    wdkModelBuildNumber?: ReturnType<typeof wdkModelBuildNumber>;
    isGuest?: ReturnType<typeof isGuest>;
};

export default WdkStateProps;