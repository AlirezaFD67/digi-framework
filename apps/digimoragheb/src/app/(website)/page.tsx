import { jsonLdSchemas } from './schema';

export default function Home() {
  return (
    <>
      {jsonLdSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div>
        <p className="global-title-md">تایتل صفحه اصلی</p>
        <p className="global-description-sm">صفحه اصلی</p>
      </div>
    </>
  );
}