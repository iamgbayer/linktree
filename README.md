# Linktree

## Summary of Implemented Features

- User authentication (login/logout)
- Dashboard for link management (add, edit, delete links)
- Link visibility toggle
- Public profile page displaying the curated links organized by categories
- Link categories management (add, edit, delete categories)

## Scope Decisions and Key Trade-offs

- SSR only on the public profile page, the rest of pages are client side rendered.
- I focused on the core functionality and easy to use features.
- I decided to use a simple login system, since this is not a core feature, and it's not the main focus of the project.
- I thought about having one simple feature to based on each user story,
    - Link visibility helps user to have control over the links they want to show on public profile.
    - Categories helps user to organize their links in a better way.
    - Simple UI/UX, user doesn't need to handle complex workflows.

## Install dependencies

```sh
yarn install
```

## Run tasks

To run the dev server for your app, use:

```sh
npx nx dev linktree
```

To create a production bundle:

```sh
npx nx build linktree
```

## Run e2e tests

```sh
npx nx e2e linktree-e2e
```

### Login credentials

It is a hardcoded user for now:

- Username: `iamgbayer`
- Password: `g123g`
