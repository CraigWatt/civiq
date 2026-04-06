<script lang="ts">
  import { onMount } from "svelte";
  import {
    clearStoredSession,
    defaultProfile,
    loadStoredSession,
    requestMagicLink,
    saveNotificationProfile,
    storeSession
  } from "$lib/auth-client";
  import type { AuthSession, NotificationProfile } from "@civiq/contracts";

  export let data: { featuredSignal: string };

  const watchItems = [
    "Nancy Pelosi",
    "Ticker-specific alerts",
    "Buy and sell percent context",
    "Email magic-link sign in"
  ];

  let email = "";
  let requestStatus = "idle";
  let requestError = "";
  let magicLink = "";
  let session: AuthSession | null = null;
  let profile: NotificationProfile = structuredClone(defaultProfile);
  let watchTickersText = "";
  let watchPoliticiansText = "";
  let profileStatus = "idle";
  let profileError = "";

  function toList(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  onMount(() => {
    const storedSession = loadStoredSession();

    if (storedSession) {
      session = storedSession;
      profile = storedSession.profile;
      watchTickersText = storedSession.profile.watchTickers.join(", ");
      watchPoliticiansText = storedSession.profile.watchPoliticians.join(", ");
    }
  });

  async function handleRequestMagicLink() {
    requestStatus = "loading";
    requestError = "";
    magicLink = "";

    try {
      const response = await requestMagicLink(email);
      magicLink = response.magicLink;
      requestStatus = "sent";
    } catch (caughtError) {
      requestStatus = "error";
      requestError =
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to send sign-in link";
    }
  }

  async function handleSaveProfile() {
    if (!session) {
      return;
    }

    profileStatus = "saving";
    profileError = "";

    const profileToSave: NotificationProfile = {
      ...profile,
      watchTickers: toList(watchTickersText),
      watchPoliticians: toList(watchPoliticiansText)
    };

    try {
      const updatedSession = await saveNotificationProfile(
        session.sessionToken,
        profileToSave
      );

      session = updatedSession;
      profile = updatedSession.profile;
      watchTickersText = updatedSession.profile.watchTickers.join(", ");
      watchPoliticiansText = updatedSession.profile.watchPoliticians.join(", ");
      storeSession(updatedSession);
      profileStatus = "saved";
    } catch (caughtError) {
      profileStatus = "error";
      profileError =
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to save notification profile";
    }
  }

  function handleSignOut() {
    clearStoredSession();
    session = null;
    profile = structuredClone(defaultProfile);
    watchTickersText = "";
    watchPoliticiansText = "";
    requestStatus = "idle";
    requestError = "";
    magicLink = "";
  }
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

    {#if session}
      <div class="status-card">
        <p class="status-label">Signed in as</p>
        <p class="status-value">{session.email}</p>
        <button class="secondary" type="button" on:click={handleSignOut}>
          Sign out
        </button>
      </div>
    {:else}
      <div class="auth-card">
        <form class="signup" on:submit|preventDefault={handleRequestMagicLink}>
          <label class="sr-only" for="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            bind:value={email}
            placeholder="Email address"
            autocomplete="email"
            required
          />
          <button type="submit" disabled={requestStatus === "loading"}>
            {requestStatus === "loading" ? "Sending..." : "Send sign-in link"}
          </button>
        </form>

        {#if requestError}
          <p class="error">{requestError}</p>
        {/if}

        {#if magicLink}
          <div class="magic-link">
            <p>Magic link ready:</p>
            <a href={magicLink}>{magicLink}</a>
            <p class="hint">
              For now this is surfaced here so we can test the flow quickly.
            </p>
          </div>
        {:else}
          <p class="hint">
            We’ll email you a magic link, then you can set your notification
            profile.
          </p>
        {/if}
      </div>
    {/if}
  </div>

  <aside class="panel">
    <h2>Notification profile</h2>

    {#if session}
      <div class="profile">
        <label>
          Delivery mode
          <select bind:value={profile.notificationMode}>
            <option value="instant">Instant</option>
            <option value="digest">Digest</option>
          </select>
        </label>

        <label>
          Digest frequency
          <select bind:value={profile.digestFrequency}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>

        <label>
          Watch tickers
          <input
            bind:value={watchTickersText}
            placeholder="NVDA, AAPL, MSFT"
          />
        </label>

        <label>
          Watch politicians
          <input
            bind:value={watchPoliticiansText}
            placeholder="Nancy Pelosi, Dan Crenshaw"
          />
        </label>

        <label class="toggle">
          <input type="checkbox" bind:checked={profile.sendBuyAlerts} />
          Send buy alerts
        </label>

        <label class="toggle">
          <input type="checkbox" bind:checked={profile.sendSellAlerts} />
          Send sell alerts
        </label>

        <button class="primary" type="button" on:click={handleSaveProfile}>
          {profileStatus === "saving" ? "Saving..." : "Save profile"}
        </button>

        {#if profileError}
          <p class="error">{profileError}</p>
        {/if}

        {#if profileStatus === "saved"}
          <p class="success">Notification profile saved.</p>
        {/if}
      </div>
    {:else}
      <p class="panel-copy">
        Sign in first to customise your notification profile and trade alerts.
      </p>
    {/if}

    <div class="divider"></div>

    <h2>What you’ll track</h2>
    <ul>
      {#each watchItems as item}
        <li>{item}</li>
      {/each}
    </ul>
  </aside>
</section>
