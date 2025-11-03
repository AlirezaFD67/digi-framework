import type { Organization, WebSite, WithContext } from "schema-dts";

export const organizationSchema: WithContext<Organization> = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "دیجی‌مراقب",
	alternateName: "Digi Moragheb",
	url: "https://digimoragheb.com",
	logo: "https://digimoragheb.com/icons/web-app-manifest-512x512.png",
	description:
		"دیجی مراقب، پلتفرم نوبت‌دهی آنلاین پزشکان متخصص، دندانپزشکان و روانشناسان. به‌راحتی از بهترین پزشکان در رشت و سراسر ایران نوبت بگیرید و سلامتی خود را مدیریت کنید.",
	contactPoint: {
		"@type": "ContactPoint",
		contactType: "customer service",
		availableLanguage: ["Persian", "fa"],
	},
	sameAs: [],
};

export const websiteSchema: WithContext<WebSite> = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "دیجی‌مراقب",
	alternateName: "Digi Moragheb",
	url: "https://digimoragheb.com",
	description:
		"دیجی مراقب، پلتفرم نوبت‌دهی آنلاین پزشکان متخصص، دندانپزشکان و روانشناسان. به‌راحتی از بهترین پزشکان در رشت و سراسر ایران نوبت بگیرید و سلامتی خود را مدیریت کنید.",
	inLanguage: "fa-IR",
	potentialAction: {
		"@type": "SearchAction",
		target: {
			"@type": "EntryPoint",
			urlTemplate: "https://digimoragheb.com/search?q={search_term_string}",
		},
		"query-input": "required name=search_term_string",
	},
};

export const jsonLdSchemas = [organizationSchema, websiteSchema];

