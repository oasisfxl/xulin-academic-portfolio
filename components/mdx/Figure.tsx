import Image from "next/image";

type FigureProps = {
  alt: string;
  caption?: string;
  height?: number;
  src: string;
  width?: number;
};

export function Figure({
  alt,
  caption,
  height = 900,
  src,
  width = 1600,
}: FigureProps) {
  return (
    <figure className="my-10">
      <Image
        alt={alt}
        className="w-full border border-white/10 object-cover"
        height={height}
        src={src}
        width={width}
      />
      {caption ? (
        <figcaption className="mt-3 text-sm leading-6 text-white/44">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
