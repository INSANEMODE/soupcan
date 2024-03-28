const Svgs = {
  REPORT:
    '<g><path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856s-.036.586-.113.856c-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a10 10 0 0 1-.443-.05 9.36 9.36 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a9 9 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581s-.027-.414-.075-.581c-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.2 2.2 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.9.9 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1"/></g>',
  APPEAL:
    '<g><path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/></g>',
  SEARCH:
    '<g><path d="M9.094 3.095c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.97-.001-8.999-4.03-9-9z"></path></g>',
};

let platformInfo;
async function getPlatformInfo() {
  console.log("mobile.getPlatformInfo");
  let sending = browser.runtime.sendMessage({
    action: "request-platforminfo",
  });
  sending.then();
}
getPlatformInfo();
async function addMenuItemToTweetDropdownMenu(node) {
  await addMenuItem(
    browser.i18n.getMessage("searchTweets").slice("🔍".length),
    Svgs.SEARCH,
    (user) => {
      let sending = browser.runtime.sendMessage({
        action: "search-tweets",
        url: "https://twitter.com/" + user,
      });
      sending.then();
    }
  );
  await addMenuItem(
    browser.i18n.getMessage("actionAppealLabel").slice("😇".length),
    Svgs.APPEAL,
    (user) => {
      let sending = browser.runtime.sendMessage({
        action: "appeal-label",
        url: "https://twitter.com/" + user,
      });
      sending.then();
    }
  );
  await addMenuItem(
    browser.i18n.getMessage("actionReportTransphobe").slice("🍅".length),
    Svgs.REPORT,
    (user) => {
      let sending = browser.runtime.sendMessage({
        action: "report-transphobe",
        url: "https://twitter.com/" + user,
      });

      sending.then();
    }
  );
}

async function addMenuItem(text, icon, callback) {
  console.log(`adding "${text}" menu item`);

  let link = await getElement(
    `#layers div[data-testid="Dropdown"] div[tabindex="0"]`,
    {
      name: "dropdown menu item index 0",
      timeout: 1000,
    }
  );
  let user = link.querySelector("span").textContent.split("@")[1];
  if (!user) {
    let links = document.querySelectorAll(
      `#layers div[data-testid="Dropdown"] div[tabindex`
    );
    link = null;
    for (let index = 0; index < links.length; index++) {
      if (links[index].querySelector("span").textContent.includes("@")) {
        link = links[index];
        break;
      }
    }
    user = link.querySelector("span").textContent.split("@")[1];
  }
  if (!link || !user) return;

  let newMenuItem = /** @type {HTMLElement} */ (link.cloneNode(true));
  newMenuItem.classList.add("custom-menu-item");
  newMenuItem.setAttribute("data-testid", "custom-menu-item");
  newMenuItem.querySelector("span").textContent = text;
  newMenuItem.querySelector("svg").innerHTML = icon;
  newMenuItem.addEventListener("click", (e) => {
    e.preventDefault();
    callback(user);
  });
  link.parentElement.insertAdjacentElement("afterend", newMenuItem);
}

function handleDropdownMenus(mutationList, dropdownObserver) {
  mutationList.forEach(async (mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(async (node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.querySelector('#layers div[data-testid="Dropdown"]')
        ) {
          await addMenuItemToTweetDropdownMenu(node);
        }
      });
    }
  });
}

function getElement(
  selector,
  { name = null, stopIf = null, timeout = Infinity, context = document } = {}
) {
  return new Promise((resolve) => {
    let startTime = Date.now();
    let rafId;
    let timeoutId;

    function stop(element, reason) {
      if (element == null) {
        console.warn(`stopped waiting for ${name || selector} after ${reason}`);
      } else if (Date.now() > startTime) {
        console.debug(
          `${name || selector} appeared after ${Date.now() - startTime} ms`
        );
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      resolve(element);
    }

    if (timeout !== Infinity) {
      timeoutId = setTimeout(stop, timeout, null, `${timeout} ms timeout`);
    }

    function queryElement() {
      let element = context.querySelector(selector);
      if (element) {
        stop(element);
      } else if (stopIf?.() === true) {
        stop(null, "stopIf condition met");
      } else {
        rafId = requestAnimationFrame(queryElement);
      }
    }

    queryElement();
  });
}
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("got message", request);
  if (request.action == "platforminfo") {
    platformInfo = request.platform;
    console.log("mobile listener got platformInfo", platformInfo);
    if (["ios", "android"].includes(platformInfo.os)) {
      const dropdownObserver = new MutationObserver(handleDropdownMenus);
      dropdownObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    } else {
      console.debug("desktop platforms not supported for this script");
    }
    sendResponse("platformInfo done");
    console.log("mobile listener sent platformInfo done");
    return Promise.resolve("done");
    

  }
  return false;
});
