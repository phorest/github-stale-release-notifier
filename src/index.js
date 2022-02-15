const core = require("@actions/core");
const verifyLastRelease = require("./stale-release-verifier").default;

verifyLastRelease().catch((err) => core.setFailed(err));
