<script lang="ts">
  export let data: { featuredSignal: string };

  const watchItems = [
    "Nancy Pelosi",
    "Ticker-specific alerts",
    "Buy and sell percent context",
    "Email magic-link sign in"
  ];
</script>

<svelte:head>
  <title>civiq</title>
  <meta
    name="description"
    content="Track congressional trades, get email alerts, and review trade context in one web app."
  />
</svelte:head>

<section class="shell">
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>

  <div class="hero">
    <p class="eyebrow">civiq</p>
    <h1>Track congressional trades without the noise.</h1>
    <p class="lede">
      Email-first, web-first, and built for fast review of official filings
      with the percentage context that actually matters.
    </p>

    <p class="signal">{data.featuredSignal}</p>

    <form class="signup" on:submit|preventDefault={() => undefined}>
      <label class="sr-only" for="email">Email address</label>
      <input id="email" name="email" type="email" placeholder="Email address" />
      <button type="submit">Send sign-in link</button>
    </form>

    <p class="hint">
      We’ll email you a magic link, then you can set your notification profile.
    </p>
  </div>

  <aside class="panel">
    <h2>What you’ll track</h2>
    <ul>
      {#each watchItems as item}
        <li>{item}</li>
      {/each}
    </ul>
  </aside>
</section>
