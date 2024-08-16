const OPTION_MAPPING: Record<number, string[]> = {
  0: ["main", "staging"],
  1: ["main"],
  2: ["staging"],
  3: ["production"],
};

chrome.runtime.onMessage.addListener((msg, sender, callback) => {
  const { branch } = msg;
  console.log(branch, msg);

  const listUrls = Array.from(
    document.getElementsByClassName("issue-link js-issue-link")
  )
    .filter((i: Element) => {
      const branches = OPTION_MAPPING[branch];
      const hasBranch = branches
        ? branches.some((branch) => {
            const sibling = i.nextElementSibling;
            return sibling && sibling.innerHTML.includes(`josys-src/${branch}`);
          })
        : false;
      return !hasBranch && !i.getAttribute("href")?.includes("axios");
    })
    .map(
      (i: Element, index: number) => `${index}. ${i.getAttribute("href")}`
    );

  const content = "\n" + listUrls.join("\n");

  const actionBtn = document.getElementsByClassName(
    "timeline-comment-action Link--secondary Button--link Button--medium Button"
  )[0] as HTMLElement;

  actionBtn.click();

  setTimeout(() => {
    const editBtn = document.getElementsByClassName(
      "dropdown-item btn-link js-comment-edit-button"
    )[0] as HTMLElement;
    editBtn.click();
  }, 1000);

  setTimeout(() => {
    const description = document.getElementsByClassName(
      "js-comment-field js-paste-markdown js-task-list-field js-quick-submit js-size-to-fit js-session-resumable CommentBox-input FormControl-textarea js-saved-reply-shortcut-comment-field"
    )[0] as HTMLTextAreaElement;
    description.value += content;
  }, 1000);
});
