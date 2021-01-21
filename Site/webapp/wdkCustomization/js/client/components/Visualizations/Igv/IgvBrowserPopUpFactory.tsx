import { values } from "d3";

interface BasePopIpConfig {
    name: string;
}

interface StringConfig extends BasePopIpConfig {
    type: "string";
    accessor: (ppd: PopUpData[]) => string;
}

interface ExternalLinkConfig extends BasePopIpConfig {
    type: "externalLink";
    value: {
        target: (ppd: PopUpData[]) => string;
        name: (ppd: PopUpData[]) => string;
    };
}

interface InternalLinkConfig extends BasePopIpConfig {
    type: "internalLink";
    value: {
        target: (ppd: PopUpData[]) => string;
        name: (ppd: PopUpData[]) => string;
    };
}

interface PopUpData {
    name: string;
    value: string;
}

const isStringConfig = (config: StringConfig | ExternalLinkConfig): config is StringConfig => config.type === "string";
const isExternalLinkConfig = (config: StringConfig | ExternalLinkConfig): config is ExternalLinkConfig =>
    config.type === "externalLink";
const isInternalLinkConfig = (config: InternalLinkConfig | ExternalLinkConfig): config is InternalLinkConfig =>
    config.type === "internalLink";

export const transformConfigToHtml = (
    config: StringConfig | ExternalLinkConfig | InternalLinkConfig,
    ppd: PopUpData[],
    trackType: string
) => {
    switch (config.type) {
        case "string":
            return "<tr><td>" + config.accessor(ppd).toString() + "</td></tr>";
        case "externalLink":
            return "<tr><td>" + config.value.toString() + "</td></tr>";
        default:
            return "foo";
    }
};
