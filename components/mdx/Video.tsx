type VideoProps = {
  caption?: string;
  poster?: string;
  src: string;
};

export function Video({ caption, poster, src }: VideoProps) {
  return (
    <figure className="my-10">
      <video
        className="w-full border border-white/10 bg-black"
        controls
        playsInline
        poster={poster}
        preload="metadata"
        src={src}
      />
      {caption ? (
        <figcaption className="mt-3 text-sm leading-6 text-white/44">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
