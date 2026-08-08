<p>
  <img src="build/thumbnail.png" width="500" />
  <h2>Blank (CSR - Legacy)</h2>
  <blockquote>Absolute flexibility. All you need to let your imagination flow.</blockquote>
</p>

### ⚠️ How to use:
When you first build your page with the theme, you'll notice nothing shows up. This is intentional, as it's up to you to use the data to build your layout.

The [PRSS Client Library](https://github.com/prss-io/prss-client/blob/master/src/index.js), is already loaded with the Theme. Use its methods to render your content.

#### Example
> Note: For a more detailed example, check out the [v1.15.0 release notes](https://github.com/hodgef/PRSS/releases/tag/v1.15.0).

```html
<script>
  const post = PRSS.getProp("item");

  PRSS.setContent("div.app", `
      <h1>${post.title}</h1>
      <div class="content">
          ${post.content}
      </div>
   `, true);
</script>

```
![image](https://github.com/prss-io/blank-theme/assets/25509135/01182596-7e65-47dd-93be-7c10599b6c3a)
![image](https://github.com/prss-io/blank-theme/assets/25509135/0b045d89-0b9d-40f8-8d30-f2dd221a388e)

Alternatively, you can apply this code to all pages of your site:

![image](https://github.com/prss-io/blank-theme/assets/25509135/5f307622-5466-41ac-b3dd-fc1be1312fc1)
![image](https://github.com/prss-io/blank-theme/assets/25509135/6a54e349-5acd-4d5e-910d-d4114a44a3c3)


<div align="right">
  <p><a href="https://prss.io"><img src="https://i.imgur.com/5OQD7eL.png" width="130" /></a></p>
</div>
