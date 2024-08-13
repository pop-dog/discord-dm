import { CampaignDateCommand } from "./date/campaign-date.js";
import { CampaignTimeCommand } from "./date/campaign-time.js";
import { PassTimeCommand } from "./date/pass-time.js";
import { DCCommand } from "./dm/dc.js";
import { PingCommand } from "./utility/ping.js";
import { ReloadCommand } from "./utility/reload.js";
import { RollCommand } from "./utility/roll.js";
import { ServerCommand } from "./utility/server.js";
import { UserCommand } from "./utility/user.js";

export const Commands = [
    CampaignDateCommand,
    CampaignTimeCommand,
    PassTimeCommand,
    DCCommand,
    PingCommand,
    ReloadCommand,
    RollCommand,
    ServerCommand,
    UserCommand
];