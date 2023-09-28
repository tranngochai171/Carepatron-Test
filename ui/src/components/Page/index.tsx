import React from 'react';

export default function Page({ children }: { children?: React.ReactNode }) {
	return <div style={{ margin: 'auto', marginTop: 24, maxWidth: '900px', padding: 10 }}>{children}</div>;
}
