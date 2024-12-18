import { useEffect } from 'react';

import Box from '@mui/material/Box';

import { Image } from 'src/components/image';
import { Lightbox, useLightBox } from 'src/components/lightbox';
import {
  Carousel,
  useCarousel,
  CarouselThumb,
  CarouselThumbs,
  CarouselArrowNumberButtons,
} from 'src/components/carousel';
import { DUMMY_IMAGE } from 'src/constfile/dummyImage';


// ----------------------------------------------------------------------
export function ProductDetailsCarousel({ images }) {
  const carousel = useCarousel({
    thumbs: {
      slidesToShow: 'auto',
    },
  });

  // const slides = images?.map((img) => ({ src: img })) || [];
   // Handle null or undefined images
   const slides = (images?.length > 0 
    ? images.map((img) => ({ src: img || DUMMY_IMAGE }))
    : [{ src: DUMMY_IMAGE }]); // Show DUMMY_IMAGE if images is empty or null

  const lightbox = useLightBox(slides);

  useEffect(() => {
    if (lightbox.open) {
      carousel.mainApi?.scrollTo(lightbox.selected, true);
    }
  }, [carousel.mainApi, lightbox.open, lightbox.selected]);

  return (
    <div>
      <div >
        <Box sx={{ mb: 2.5, position: 'relative' }}  >
          <CarouselArrowNumberButtons
            {...carousel.arrows}
            options={carousel.options}
            totalSlides={carousel.dots.dotCount}
            selectedIndex={carousel.dots.selectedIndex + 1}
            sx={{ right: 16, bottom: 16, position: 'absolute' }} 
          />

          <Carousel carousel={carousel} sx={{ borderRadius: 2 }}>
            {slides.map((slide) => (
              <Image
                key={slide.src  || DUMMY_IMAGE}
                alt={slide.src  || DUMMY_IMAGE}
                src={slide.src  || DUMMY_IMAGE}
                ratio="1/1"
                onClick={() => lightbox.onOpen(slide.src  || DUMMY_IMAGE)}
                sx={{ cursor: 'zoom-in', minWidth: 320, borderRadius: 2 }}
                // style={{height:"500px"}}
              />
            ))}
          </Carousel>
        </Box>

        <CarouselThumbs
          ref={carousel.thumbs.thumbsRef}
          options={carousel.options?.thumbs}
          slotProps={{ disableMask: true }}
          sx={{ width: 360 }}
        >
          {slides.map((item, index) => (
            <CarouselThumb
              key={item.src}
              index={index}
              src={item.src || DUMMY_IMAGE}
              selected={index === carousel.thumbs.selectedIndex}
              onClick={() => carousel.thumbs.onClickThumb(index)}
            />
          ))}
        </CarouselThumbs>
      </div>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        onGetCurrentIndex={(index) => lightbox.setSelected(index)}
      />
    </div>
  );
}
