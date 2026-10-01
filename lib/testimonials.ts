/**
 * Only add testimonials that real clients have written and approved for
 * publication. The homepage section stays hidden while this list is empty.
 */
export type Testimonial = {
  quote: string;
  /** As the client agreed to be credited, e.g. "Priya S." or "Client, Pune". */
  attribution: string;
  service?: string;
};

export const testimonials: Testimonial[] = [];
