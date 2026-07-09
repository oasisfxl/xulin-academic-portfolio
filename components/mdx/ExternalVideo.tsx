type ExternalVideoProps = {
  caption?: string;
  src: string;
  title: string;
};

export function ExternalVideo({ caption, src, title }: ExternalVideoProps) {
  return (
    <figure className="my-10">
      <div className="aspect-video w-full overflow-hidden border border-white/10 bg-black">
        <iframe
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          loading="lazy"
          src={src}
          title={title}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm leading-6 text-white/44">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
