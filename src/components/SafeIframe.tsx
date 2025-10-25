import { FC, IframeHTMLAttributes } from 'react';

interface SafeIframeProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  title: string;
}

const SafeIframe: FC<SafeIframeProps> = ({ title, ...props }) => {
  return (
    <iframe
      title={title}
      sandbox="allow-same-origin allow-scripts"
      {...props}
      referrerPolicy="no-referrer"
      loading="lazy"
    />
  );
};

export default SafeIframe;
