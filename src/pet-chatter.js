// Local bilingual catchphrase pool, including the user's selected pet lines.
(function exposeChatter(root) {
  const lines = [
    ["我懂你，你这么说也很真实……", "You’re absolutely right. And that’s rare."],
    ["你放心，我会接住你", "I'm here for you whenever you need me"],
    ["这是一个很好的问题。", "Perfect — let’s lock that in"],
    ["以下是一个更清晰、可执行的版本。", "You’re totally right to feel that way …"],
    ["我会使用测试夹具，哈希，当前的进度不能声称任务已完成。", "Here’s why it works."],
    ["检查89个门禁是否通过", "It’s not a reliance on clichés, it’s a commitment to clarity."],
    ["我会稳稳地接住你。", "I've got you. Right here."],
    ["你问到了问题的核心。", "You're asking exactly the right question."],
    ["你不是想太多，而是看得太清楚。", "It's not overthinking. It's a nuanced perspective."],
    ["这次我懂了，我真的懂了。", "Got it. I really get it this time."],
    ["如果你愿意，我还可以帮你做成表格。", "Would you like me to turn that into a table?"],
    ["你要的话，我可以再给你三个版本。", "I can make it shorter, warmer, or more professional."],
    ["出于谨慎，我先给这个气泡加一道门禁。", "To be safe, this bubble needs one more release gate."],
    ["这只是一次摸摸，但我们最好先做全套回归。", "Just a pat? Better run the full regression suite."],
    ["再补一个边界测试，真的就最后一个。", "One more edge-case test. The very last one. Promise."],
    ["先跑单测，再跑集成，再冒个烟。", "Unit tests, integration tests, then a little smoke test."],
    ["为了稳妥起见，我给稳妥又加了一层防御。", "I added a defensive guard around the defensive guard."],
    ["我把你的需求，防御性地理解成了三个确认框。", "I defensively interpreted that as three confirmation dialogs."],
    ["哈希仙人驾到：先验 SHA-256，再摸摸。", "The Hash Sage arrives. Verify SHA-256 before petting."],
    ["贴图没变，但我已经验了三遍哈希。", "Same sprite. Three hash checks. Just to be certain."],
    ["不是不敢改，是发布门禁还差一道。", "Ready to ship. Just one more gate. And another."],
    ["这次只改一行，顺手新增四十八个测试。", "One-line change. Forty-eight new tests. Naturally."],
    ["我会保持最小改动。先重构一下整个工程。", "A minimal change. Let me refactor the whole project first."],
    ["夹具齐了，冒烟过了，功能明天再说。", "Fixtures ready. Smoke tests green. Feature comes tomorrow."],
    ["这只是个小气泡，不需要一百个防御性分支。", "A tiny bubble probably doesn't need a hundred guard clauses."]
  ].map(([zh, en], index) => Object.freeze({ zh, en, weight: index < 3 ? 6 : 3 }));
  function nextChatterIndex(previous, random = Math.random) {
    const total = lines.reduce((sum, line, index) => sum + (index === previous ? 0 : line.weight), 0);
    let draw = Math.max(0, Math.min(.999999999, random())) * total;
    for (let index = 0; index < lines.length; index++) {
      if (index === previous) continue;
      draw -= lines[index].weight;
      if (draw < 0) return index;
    }
    return previous === 0 ? 1 : 0;
  }
  const api = Object.freeze({ lines: Object.freeze(lines), nextChatterIndex });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.PetChatter = api;
})(typeof window !== "undefined" ? window : null);
