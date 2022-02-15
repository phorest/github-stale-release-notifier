const core = require("@actions/core");
const { verifyLastRelease } = require("./stale-release-verifier");

verifyLastRelease().catch((err) => core.setFailed(err));
