import type { Metadata } from 'next';
import { ImageEditor } from '@/components/image-editor/ImageEditor';

export const metadata: Metadata = {
  title: 'Image Editor — Add & Change Objects with AI',
};

export default function ImageEditorPage() {
  return <ImageEditor />;
}
