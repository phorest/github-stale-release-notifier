# github-stale-release-notifier

GitHub Action that checks if the latest draft release is stale according to the `stale-days` parameter. When the release is considered stale the notification is sent to the configured webhook.

## Example

```yaml
name: notify-stale-release
on:
    workflow_dispatch:
        branches:
            - main
    schedule:
        - cron: "30 21 * * 1-5"
jobs:
    setup:
        runs-on: ubuntu-latest
        steps:
            - name: Check if there's a stale draft release
              id: notify
              uses: phorest/github-stale-release-notifier@v1.0.3
              with:
                  github-token: ${{ secrets.GITHUB_TOKEN }}
                  stale-days: 1
                  slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Usage

Configure this action in your workflows providing the inputs described below in order to get notified in `x` of a draft release that hasn't been release yet. Works nicely with [Release Drafter](https://github.com/release-drafter/release-drafter)

### `github-token`

**Required** A GitHub token. See below for additional information.

### `stale-days: 1`

_Optional_ The number of days after which the release is considered stale. Default is `1`.

### `slack-webhook-url: url`

**Required** Slack Webhook Url where the notifications are sent.
