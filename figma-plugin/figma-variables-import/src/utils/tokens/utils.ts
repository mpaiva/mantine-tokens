import type { JsonToken, JsonTokenGroup } from "./types"

export function isChildName(name: string): boolean {
	return name.charCodeAt(0) !== 36 /* "$" */
}

export function isToken(obj: JsonTokenGroup | JsonToken): obj is JsonToken {
	return typeof obj === "object" && "$value" in obj
}

export function isTokenGroup(obj: JsonTokenGroup | JsonToken): obj is JsonTokenGroup {
	return typeof obj === "object" && !("$value" in obj)
}

export function isAliasValue(value: string): boolean {
	return value.charCodeAt(0) === 123 /* "{" */ && value.charCodeAt(value.length - 1) === 125 /* "}" */
}

export function getAliasTargetName(value: any): string | null {
	if (typeof value === "string" && value.charCodeAt(0) === 123 /* "{" */ && value.charCodeAt(value.length - 1) === 125 /* "}" */)
		return value.slice(1, -1)
	else return null
}

export function isCompoundValue(value: any): boolean {
	if (typeof value !== "string") return false
	// Check if the value contains multiple references like "{ref1} {ref2}"
	const referencePattern = /\{[^}]+\}/g
	const matches = value.match(referencePattern)
	return matches !== null && matches.length > 1
}

export function getCompoundReferences(value: string): string[] {
	const referencePattern = /\{([^}]+)\}/g
	const references: string[] = []
	let match
	while ((match = referencePattern.exec(value)) !== null) {
		references.push(match[1])
	}
	return references
}
