## not equal
Here is an example of a not equal query using the equals operator:

```js
const users = await prisma.user.findMany({
  where: {
    id: {
      not: {
        equals: 1, // exclude users with id = 1
      },
    },
  },
});
```

Alternatively, you can use the in operator to exclude multiple values. Here is an example:

```js
const excludedIds = [1, 2, 3];

const users = await prisma.user.findMany({
  where: {
    id: {
      not: {
        in: excludedIds, // exclude users with ids in excludedIds array
      },
    },
  },
});
```

## Dynamicaly added where conditions
To create a where condition dynamically in Prisma, you can use object spread and the optional chaining operator in JavaScript. Here is an example of how you can do it:


```js
const where: any = {};

if (name) {
  where.name = {
    contains: name,
    mode: 'insensitive',
  };
}

if (age) {
  where.age = {
    equals: age,
  };
}

const users = await prisma.user.findMany({
  where,
});
```