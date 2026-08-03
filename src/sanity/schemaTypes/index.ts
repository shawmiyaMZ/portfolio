import type { SchemaTypeDefinition } from "sanity";
import { blockContent } from "./blockContent";
import { post, profile, project, tag } from "./documents";

export const schemaTypes: SchemaTypeDefinition[] = [
  profile,
  project,
  post,
  tag,
  blockContent,
];
