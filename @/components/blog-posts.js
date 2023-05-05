import posts from '../posts/index.js'
import ardi, { css, html, svg } from '//unpkg.com/ardi'

ardi({
  tag: 'blog-posts',
  props: {
    nextpagelabel: [String, 'Next Page'],
    pagelabel: [String, 'Page'],
    pagesize: [Number, 10],
    prevpagelabel: [String, 'Prevous Page'],
  },
  state: () => ({ page: 0 }),
  icon(name) {
    const icons = {
      leftArrow: 'M20,9V15H12V19.84L4.16,12L12,4.16V9H20Z',
      rightArrow: 'M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z',
    }
    return svg`
      <svg viewBox="0 0 24 24">
        <path d=${icons[name]} />
      </svg>
    `
  },
  template() {
    const lastPage = Math.floor(posts?.length / this.pagesize) + 1
    return html`
      <ul>
        ${posts
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .filter(
            (post, i) =>
              i >= this.page * this.pagesize &&
              i < this.page * this.pagesize + this.pagesize
          )
          .map(
            (post) => html`
              <li>
                <app-link>
                  <a href=${post.href}>
                    <img src=${post.heroImg} />
                    <div>
                      <div part="title">${post.title}</div>
                      <small part="date"
                        >${new Date(post.date).toLocaleDateString()}</small
                      >
                    </div>
                  </a>
                </app-link>
              </li>
            `
          )}
      </ul>
      <div part="pagination">
        <button
          part="pagination-prev"
          @click=${() => this.page--}
          disabled=${this.page > 0 ? null : true}
          aria-label=${this.prevpagelabel}
        >
          ${this.icon('leftArrow')}
        </button>
        ${this.pagelabel} ${this.page + 1} / ${lastPage}
        <button
          part="pagination-next"
          @click=${() => this.page++}
          disabled=${this.page + 1 < lastPage ? null : true}
          aria-label=${this.nextpagelabel}
        >
          ${this.icon('rightArrow')}
        </button>
      </div>
    `
  },
  styles: css`
    :host {
      display: grid;
      gap: 1.5rem;
    }
    ul,
    li {
      list-style: none;
    }
    ul {
      display: grid;
      gap: 1.5rem;
      padding: 0;
    }
    a {
      align-items: center;
      color: currentColor;
      display: grid;
      gap: 1rem;
      grid-template-columns: 4rem 1fr;
      overflow: hidden;
      text-decoration: none;
    }
    a:hover [part='title'],
    a:focus [part='title'] {
      text-decoration: underline;
      text-decoration-color: var(--theme-color);
    }
    img {
      border-radius: 50%;
      display: block;
      height: 4rem;
      object-fit: cover;
      object-position: top center;
      width: 4rem;
    }
    [part='pagination'] {
      align-items: center;
      display: flex;
      font-size: 0.8rem;
      justify-content: space-between;
    }
    svg {
      display: block;
      fill: currentColor;
      height: 24px;
      width: 24px;
    }
  `,
})
