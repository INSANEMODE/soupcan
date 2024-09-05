var browser = browser || chrome;

const blueBlockerExtensionIds = [
                                    "jgpjphkbfjhlbajmmcoknjjppoamhpmm", // Chrome
                                    "{119be3f3-597c-4f6a-9caf-627ee431d374}", // Firefox
                                    "jphoieibjlbddgacnjpfjphmpambipfl" // local testing
                                 ];


let platformInfo;
async function getPlatform() {
	platformInfo = await browser.runtime.getPlatformInfo();
	console.log(`[soupcan] getPlatform: ${platformInfo}`)
	return platformInfo;
};


async function isMobile()
{
	await browser.runtime.getPlatformInfo().then((platformInfo) => {
		if(["android", "ios"].includes(platformInfo.os))
		{
			console.log("[soupcan] is mobile");
			return true;
		}
		else
		{
			console.log("[soupcan] is not mobile");
			return false;
		}
	})
}
// used for local testing
// platformInfo = new Object();
// platformInfo.os = "android";
const permissions = {
origins:
	["*://*.twitter.com/*", "*://*.x.com/*"],
};
const filter = {
url:
[{ hostContains: "twitter.com",  }, { hostContains: "x.com" }],
};
async function checkHostPermissions(details) {
	if (details.url.includes("oauth2")) {
		// They are logging in to Twitter for Soupcan, so they're
		// probably in the setup. Don't pop open a new setup window.
		return;
	}
	if(!await browser.permissions.contains(permissions)) {
		browser.tabs.create({
url: getURL('start.html?permissions=1')
		});

	}
}
browser.webNavigation.onCompleted.addListener(checkHostPermissions, filter);

function iOS() {
	return [
	           "ios"
	       ].includes(platformInfo.os);
}
function android() {
	return [
	           "android"
	       ].includes(platformInfo.os);
}
function isMobile() {
	return [
	           "android", "ios"
	       ].includes(platformInfo.os);
}

async function start() {
	await getPlatform();
	initDatabase();
	//sendIntegrationRequest();
	browser.storage.local.get(["database", "state"], v => {
		if (!v.database) {
			if (!v.state) {
				// First time setup
				browser.tabs.create({
url: getURL('start.html')
				});
			} else {
				// Logged in but not database
				browser.tabs.create({
url: getURL('start.html?download=1')
				});
			}
		}

		if (v.state) {
			handleFetch("https://api.beth.lgbt/moderation/user-data?state=" + v.state, response => {
				response = response["json"];

				if (response["is_moderator"]) {
					browser.storage.local.set({
"is_moderator": true
					});
					if (!isMobile()) {
						browser?.contextMenus.create({
id: "moderate",
title: browser.i18n.getMessage("actionModerateReports"),
contexts: ["page"]
						});
					}
				}
				if (response["trust_level"]) {
					browser.storage.local.set({
"trust_level": response["trust_level"]
					});
				}
			});
		}
	});

	if (!browser.menus) {
		browser.menus = browser.contextMenus;
	}


	if (!isMobile() ) {
		if (!browser.menus) {
			browser.menus = browser.contextMenus;
		}
		console.log("Adding context menus");
		browser.contextMenus.create({
id: "report-transphobe",
title: browser.i18n.getMessage("actionReportTransphobe"),
contexts: ["link"],
targetUrlPatterns: ["*://*.twitter.com/*", "*://*.x.com/*"]
		});
		browser.contextMenus.create({
id: "appeal-label",
title: browser.i18n.getMessage("actionAppealLabel"),
contexts: ["link"],
targetUrlPatterns: ["*://*.twitter.com/*", "*://*.x.com/*"]
		});
		browser.contextMenus.create({
id: "search-tweets",
title: browser.i18n.getMessage("searchTweets"),
contexts: ["link"],
targetUrlPatterns: ["*://*.twitter.com/*", "*://*.x.com/*"]
		});
		browser.menus.create({
id: "run-setup",
title: browser.i18n.getMessage("actionRerunSetup"),
contexts: ["page"]
		});
		browser.menus.create({
id: "update-database",
title: browser.i18n.getMessage("actionUpdateDatabase"),
contexts: ["page"]
		});
		browser.menus.create({
id: "options",
title: browser.i18n.getMessage("actionOptions"),
contexts: ["page"]
		});
		browser.menus.create({
id: "wiawbot",
title: browser.i18n.getMessage("actionWiawbot"),
contexts: ["page"]
		});

		browser.contextMenus.onClicked.addListener(function (info, tab) {
			switch (info.menuItemId) {
			case "appeal-label":
				browser.tabs.sendMessage(tab.id, {
"action": "appeal-label",
"url": info.linkUrl
				}).then((response) => {
					// ?
				});
				break;
			case "moderate":
				browser.tabs.create({
url: getURL('moderation.html')
				});
				break;
			case "options":
				browser.tabs.create({
url: getURL('options.html')
				});
				break;
			case "wiawbot":
				browser.tabs.create({
url: getURL('wiawbot.html')
				});
				break;
			case "report-transphobe":
				browser.tabs.sendMessage(tab.id, {
"action": "report-transphobe",
"url": info.linkUrl
				}).then((response) => {
					// ?
				});
				break;
			case "run-setup":
				browser.tabs.create({
url: getURL('start.html')
				});
				break;
			case "search-tweets":
				browser.tabs.sendMessage(tab.id, {
"action": "search-tweets",
"url": info.linkUrl
				}).then((response) => {
					if (response) {
						browser.tabs.create({
url: "https://twitter.com/search?q=from%3A" + response + "%20(trans%20OR%20transgender%20OR%20gender%20OR%20TERF%20OR%20cis)&src=typed_query&f=live"
						});
					}
				});
				break;
			case "update-database":
				browser.tabs.sendMessage(tab.id, {
"action": "update-database"
				}).then((response) => {
					// ?
				});
				break;
			default:
				// Do not process.
				break;
			}
		});
	}
	console.log("start complete");
}

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("onMessage: " + request.action);
	console.log("sender.tab.url: " + sender.tab.url);
	console.log("sender.tab.id: " + sender.tab.id);
	switch (request.action) {
	case "appeal-label":
		browser.tabs.sendMessage(sender.tab.id, {
"action": "appeal-label",
"url": request.url
		}).then(() => {
			//?sendResponse({ response: "Response from background script" });
		});
		return Promise.resolve("done");
	case "moderate":
		browser.tabs.create({
url: getURL('moderation.html')
		});
		return Promise.resolve("done");
	case "options":
		browser.tabs.create({
url: getURL('options.html')
		});
		return Promise.resolve("done");
	case "wiawbot":
		browser.tabs.create({
url: getURL('wiawbot.html')
		});
		return Promise.resolve("done");
	case "report-transphobe":
		browser.tabs.sendMessage(sender.tab.id, {
"action": "report-transphobe",
"url": request.url
		}).then((response) => {
			// ?
		});
		return Promise.resolve("done");
	case "run-setup":
		browser.tabs.create({
url: getURL('start.html')
		});
		return Promise.resolve("done");
	case "search-tweets":
		browser.tabs.sendMessage(sender.tab.id, {
"action": "search-tweets",
"url": request.url
		}).then((response) => {
			if (response) {
				browser.tabs.create({
url: "https://twitter.com/search?q=from%3A" + response + "%20(trans%20OR%20transgender%20OR%20gender%20OR%20TERF%20OR%20cis)&src=typed_query&f=live"
				});
			}
		});
		return Promise.resolve("done");
	case "update-database":
		browser.tabs.sendMessage(sender.tab.id, {
"action": "update-database"
		}).then((response) => {
			// ?
		});
		return Promise.resolve("done");
	case "request-platforminfo":
		getPlatform();
		console.log("request-platforminfo: " +platformInfo.os);
		browser.tabs.sendMessage(sender.tab.id, {
"action": "platforminfo",
"platform": platformInfo
		}).then((response) => {
			// ?
		});
		return Promise.resolve("done");
	case "openTerfListTab":
		const transphobeList = request.data;

		const htmlContent = `
		  <html>
			<head>
			  <meta charset="UTF-8">
			  <title>Transphobe List</title>
			  <style>
				body {
				background-color: #121212;
				color: #ffffff;
				font-family: Arial, sans-serif;
				margin: 20px;
				}
				h1 {
				color: #ff4081;
				}
				ul {
				list-style-type: none;
				padding: 0;
				}
				li {
				margin-bottom: 15px;
				padding: 10px;
				border: 1px solid #333;
				border-radius: 5px;
				background-color: #1e1e1e;
				}
				a {
					color: #00BFFF; /* Light Blue */
					text-decoration: none;
					}

				a:hover {
					color: #FFD700; /* Gold on hover */
					text-decoration: underline;
					}
				strong {
				color: #ff4081;
				}
			  </style>
			</head>
			<body>
			  <h1>Transphobe List (${transphobeList.length} users)</h1>
			  <ul>
				${transphobeList.map(user => `
				  <li>
					<strong><a href="https://x.com/${encodeURIComponent(user.screenName)}" target="_blank">${user.screenName}</a></strong> (${user.name})
					<br>User ID: ${user.userid}
					<br>Reason: ${user.reason}
				  </li>
				`).join('')}
			  </ul>
			</body>
		  </html>
		`;
	
		const blob = new Blob([htmlContent], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
	
		// Create a new tab with the generated content
		browser.tabs.create({ url });
		return Promise.resolve("done");
	default:
		return false;
		// Do not process.
	}
});


function getURL(path) {
	return chrome.runtime.getURL(path);
}

async function doFetch(url) {
	return new Promise((resolve, reject) => {
		function callback(response) {
			if ([200, 201, 202].includes(response["status"])) {
				resolve(response);
			} else {
				reject(response);
			}
		}

		handleFetch(url, callback);
	});
}

const handleFetch = async (url, sendResponse) => {
	try {
		const response = await fetch(url);
		let json = "";
		try {
			json = await response.clone().json();
		} catch (error) {

		}
		const text = await response.text();
		sendResponse({"status": response.status, "text": text, "json": json});
	} catch (fetchError) {
		sendResponse({"status": 503});
	}
};

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action == "fetch") {
		handleFetch(message.url, sendResponse);
		return true;
	}
	return false;
});

// BlueBlocker integration
browser.runtime.onMessageExternal.addListener((m, s, r) => {
	(async (message, sender, sendResponse) => {
		console.log("Got external message",message,sender);
		if (blueBlockerExtensionIds.includes(sender.id)) {
			if (message.action == "check_twitter_user") {
				if (message.data.legacy.screen_name) {
					let dbEntry = await getDatabaseEntry(message.data.legacy.screen_name);

					if (dbEntry) {
						//console.log("external message response: ",dbEntry);
						sendResponse({
status: "SUCCESS",
result: {
block: dbEntry["label"].includes("transphobe") ? true : false,
								reason: dbEntry.reason,
								// This will get ignored by Blue Blocker
								reported_at: dbEntry.time
							}
						});
					} else {
						//console.log("external message response: not found");
						sendResponse({
status: "SUCCESS",
result: {
block: false
							}
						});
					}
				}
			}
		}
	})(m, s, r);
	return true
});

const registerMessage = {
action: 'register'
	,
name: 'Soupcan'
	,
};

const SuccessStatus = 'SUCCESS';
const ErrorStatus = 'ERROR';
const logstr = '[Soupcan]';

browser.runtime.onInstalled.addListener(details => {
	if (details.reason === 'install' || details.reason === 'update') {
		console.log(logstr, 'extension installed');
		sendIntegrationRequest();
	}
});
function sendIntegrationRequest() {
	console.log(logstr, 'sending message to blue blocker');
	// This is all you need to send
	browser.runtime
	.sendMessage("{119be3f3-597c-4f6a-9caf-627ee431d374}", registerMessage)
	.then(response => {
		if (response.status !== SuccessStatus) {
			console.error(
			    logstr,
			    'BlueBlocker ran into an error',
			    (response).message,
			);
		}
	})
	.catch(e => {
		console.error(logstr, 'API error:', e);
	});
}
if ('function' === typeof(importScripts)) {
	importScripts("database.js");
}


start();
