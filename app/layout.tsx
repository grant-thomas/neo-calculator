import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import '../styles/global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'NEO Calculator',
	description: 'NEO Products Plug Length Calculator',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<meta name='viewport' content='width=device-width, initial-scale=1' />
			<body className={inter.className}>{children}</body>
		</html>
	);
}
