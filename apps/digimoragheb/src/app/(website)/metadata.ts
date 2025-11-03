import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "دیجی مراقب | نوبت‌دهی آنلاین پزشکان متخصص و عمومی",
	description:
		"دیجی مراقب، پلتفرم نوبت‌دهی آنلاین پزشکان متخصص، دندانپزشکان و روانشناسان. به‌راحتی از بهترین پزشکان در رشت و سراسر ایران نوبت بگیرید و سلامتی خود را مدیریت کنید.",
	metadataBase: new URL("https://digimoragheb.com"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "دیجی مراقب | نوبت‌دهی آنلاین پزشکان متخصص و عمومی",
		description:
			"دیجی مراقب، پلتفرم نوبت‌دهی آنلاین پزشکان متخصص، دندانپزشکان و روانشناسان. به‌راحتی از بهترین پزشکان در رشت و سراسر ایران نوبت بگیرید و سلامتی خود را مدیریت کنید.",
		url: "/",
		siteName: "دیجی‌مراقب",
		locale: "fa_IR",
		type: "website",
		images: [
			{
				url: "/icons/web-app-manifest-512x512.png",
				width: 512,
				height: 512,
				alt: "دیجی‌مراقب",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Digi Moragheb | دیجی‌مراقب",
		description: "ما همه خدمات دهندگان حوزه های مختلف سلامت را به مشتریان و بیماران ارتباط می دهیم",
		images: ["/icons/web-app-manifest-512x512.png"],
	},
	icons: {
		icon: [
			{ url: "/icons/favicon.svg", type: "image/svg+xml" },
			{ url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
		],
		apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
		other: [
			{
				rel: "mask-icon",
				url: "/icons/favicon.svg",
			},
		],
	},
	manifest: "/icons/site.webmanifest",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "دیجی‌مراقب",
	},
	applicationName: "دیجی‌مراقب",
	formatDetection: {
		telephone: true,
	},
	other: {
		enamad: "54007672",
	},
};

