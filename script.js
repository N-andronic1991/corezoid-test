//  Функція для генерації випадкового цілого числа (integer)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функція для генерації випадкової дати у форматі timestamp за вимогою із JSON-schema(typeof Date===integer)
function getRandomDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(getRandomInt(start, end)).getTime();
}

// Функція для генерації реалістичних імен (title)
function getRandomTitle() {
  const titles = [
    "Project Alpha",
    "Summer Event",
    "Weekly Meeting",
    "Product Launch",
    "Team Sync",
    "Quarterly Review",
    "Marketing Plan",
    "Client Presentation",
    "Budget Discussion",
    "Tech Conference",
  ];
  return titles[getRandomInt(0, titles.length - 1)];
}

// Функція для генерації опису відповідно до title
function getDescriptionForTitle(title) {
  const descriptions = {
    "Project Alpha":
      "A high-priority project aimed at developing new product features.",
    "Summer Event":
      "A fun and engaging event to celebrate the team's summer achievements.",
    "Weekly Meeting":
      "A weekly sync-up to discuss ongoing tasks and future plans.",
    "Product Launch":
      "Launching our latest product to the public, with marketing and demo sessions.",
    "Team Sync":
      "A routine team meeting to align on project goals and upcoming deadlines.",
    "Quarterly Review":
      "Review of the team's quarterly performance and key achievements.",
    "Marketing Plan":
      "Developing and discussing strategies for the next marketing campaign.",
    "Client Presentation":
      "A presentation for our top client to showcase the latest project updates.",
    "Budget Discussion":
      "A discussion to plan and allocate resources for upcoming projects.",
    "Tech Conference":
      "An exciting opportunity to present our technology at a global conference.",
  };
  return descriptions[title] || "Description not available.";
}

function getRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => characters[getRandomInt(0, characters.length - 1)]
  ).join("");
}

function getRandomBoolean() {
  return Math.random() < 0.5;
}

function generateRandomValue(schema, title) {
  switch (schema.type) {
    case "integer":
      if (schema.minimum || schema.maximum) {
        return getRandomInt(schema.minimum || 0, schema.maximum || 100);
      }
      if (schema === "startDate" || schema === "endDate") {
        return getRandomDate(2020, 2025); // Генеруємо випадкову дату від 2022 до 2025 року
      }
      return getRandomInt(0, 100);
  }
}

function generateRandomValue(schema, title) {
  if (schema.type === "integer") {
    if (schema.minimum || schema.maximum) {
      return getRandomInt(schema.minimum || 0, schema.maximum || 100);
    }

    // Якщо це дата, генеруємо timestamp
    if (schema === "startDate" || schema === "endDate") {
      return getRandomDate(2022, 2025); // Генеруємо випадкову дату від 2022 до 2025 року
    }
    return getRandomInt(0, 100);
  }
  if (schema.type === "string") {
    if (schema === "title") {
      return getRandomTitle(); // Для "title" генеруємо ім'я
    }
    if (schema === "description") {
      return getDescriptionForTitle(title); // Повертаємо опис на основі title
    }
    return getRandomString(10);
  }
  if (schema.type === "boolean") {
    return getRandomBoolean();
  }
  if (schema.type === "array") {
    const length = getRandomInt(1, 5); // Генеруємо від 1 до 5 елементів
    return Array.from({ length }, () => generateRandomValue(schema.items));
  }
  if (schema.type === "object") {
    const obj = {};
    for (const key in schema.properties) {
      obj[key] = generateRandomValue(schema.properties[key]);
    }
    return obj;
  }
  if (schema.enum) {
    return schema.enum[getRandomInt(0, schema.enum.length - 1)];
  }
  if (schema.anyOf) {
    const randomSchema = schema.anyOf[getRandomInt(0, schema.anyOf.length - 1)];
    return generateRandomValue(randomSchema);
  }
  return null;
}

function generateObjectFromSchema(schema) {
  const result = {};
  let title = "";
  for (const key of schema.required) {
    // Генеруємо title і передаємо його для генерування опису
    if (key === "title") {
      title = generateRandomValue("title"); // Генеруємо title
      result[key] = title;
    } else if (key === "description") {
      result[key] = generateRandomValue("description", title);
    } else {
      result[key] = generateRandomValue(schema.properties[key]);
    }
  }
  return result;
}

// JSON-схема
const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    attendees: {
      type: "object",
      $id: "#attendees",
      properties: {
        userId: { type: "integer" },
        access: {
          enum: ["view", "modify", "sign", "execute"],
        },
        formAccess: {
          enum: ["view", "execute", "execute_view"],
        },
      },
      required: ["userId", "access"],
    },
  },
  type: "object",
  properties: {
    id: {
      anyOf: [{ type: "string" }, { type: "integer" }],
    },
    title: { type: "string" },
    description: { type: "string" },
    startDate: { type: "integer" }, // Дата
    endDate: { type: "integer" }, // Дата
    attendees: {
      type: "array",
      items: { $ref: "#attendees" },
      default: [],
    },
    parentId: {
      anyOf: [{ type: "null" }, { type: "string" }, { type: "integer" }],
    },
    locationId: {
      anyOf: [{ type: "null" }, { type: "integer" }],
    },
    process: {
      anyOf: [
        { type: "null" },
        {
          type: "string",
          pattern:
            "https://[a-z]+\\.corezoid\\.com/api/1/json/public/[0-9]+/[0-9a-zA-Z]+",
        },
      ],
    },
    readOnly: { type: "boolean" },
    priorProbability: {
      anyOf: [{ type: "null" }, { type: "integer", minimum: 0, maximum: 100 }],
    },
    channelId: {
      anyOf: [{ type: "null" }, { type: "integer" }],
    },
    externalId: {
      anyOf: [{ type: "null" }, { type: "string" }],
    },
    tags: { type: "array" },
    form: {
      type: "object",
      properties: {
        id: { type: "integer" },
        viewModel: { type: "object" },
      },
      required: ["id"],
    },
    formValue: { type: "object" },
  },
  required: ["id", "title", "description", "startDate", "endDate", "attendees"],
};

// Генеруємо об'єкт на основі схеми
const randomObject = generateObjectFromSchema(schema);
// console.log(randomObject);
