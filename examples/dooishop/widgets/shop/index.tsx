import "../styles/index.css";
import clsx from "clsx";
import { Star, ShoppingBag, User, Tag, MapPin, LayoutGrid, List, Square } from "lucide-react";
import { useWidgetProps } from "fastapps";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

type Product = {
  id: number;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  image: string;
  tags: Array<{
    icon: string;
    text: string;
  }>;
  discount?: string | null;
  isNew?: boolean;
};

type ShopWidgetProps = {
  query?: string;
  products?: Product[];
  totalResults?: number;
};

type ViewMode = 'carousel' | 'grid' | 'list';

// Star rating component
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center gap-0">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={14}
          className="fill-orange-400 text-orange-400"
        />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star size={14} className="text-gray-200" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={14} className="fill-orange-400 text-orange-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={14}
          className="text-gray-200"
        />
      ))}
    </div>
  );
}

// Tag icon component
function TagIcon({ icon }: { icon: string }) {
  const iconProps = { size: 11, className: "text-gray-500" };

  switch (icon) {
    case "ShoppingBag":
      return <ShoppingBag {...iconProps} />;
    case "User":
      return <User {...iconProps} />;
    case "Tag":
      return <Tag {...iconProps} />;
    case "MapPin":
      return <MapPin {...iconProps} />;
    default:
      return <Tag {...iconProps} />;
  }
}

// Product card component with animations
function ProductCard({ product, viewMode, index }: { product: Product; viewMode: ViewMode; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.05
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={cardVariants}
        className="bg-white rounded-xl overflow-hidden shadow-sm flex gap-4 p-3"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* List view layout */}
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 truncate">{product.title}</h3>
          <p className="text-xs text-gray-500">{product.brand}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-bold text-gray-900">US${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">US${product.originalPrice}</span>
            )}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-medium self-center"
        >
          Buy now
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      layoutId={`product-${product.id}`}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className={clsx(
        "bg-white rounded-2xl overflow-hidden shadow-sm",
        viewMode === 'carousel' && "flex-none w-[calc(50%-6px)] sm:w-64 first:ml-0 last:mr-0 snap-start"
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Product Image with animation */}
      <motion.div
        className="relative aspect-square bg-gray-50 overflow-hidden"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />

        {/* Discount badge with animation */}
        {product.discount && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-2.5 right-2.5 bg-blue-600 text-white px-2 py-0.5 rounded-md text-xs font-semibold"
          >
            {product.discount}
          </motion.div>
        )}
      </motion.div>

      {/* Product Info */}
      <div className="p-3 sm:p-3.5">
        {/* Rating */}
        <motion.div
          className="mb-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <StarRating rating={product.rating} />
        </motion.div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
          {product.title}
        </h3>

        {/* Brand and reviews */}
        <p className="text-xs text-gray-500 mb-2.5">
          {product.brand} · {product.reviews.toLocaleString()} reviews
        </p>

        {/* Tags - consistent layout with fixed height */}
        <div className={clsx(
          "flex flex-wrap gap-1 mb-3 min-h-[28px]",
          viewMode === 'carousel' && "hidden sm:flex"
        )}>
          {product.tags.slice(0, 3).map((tag, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded-full"
            >
              <TagIcon icon={tag.icon} />
              <span className="text-[10px] text-gray-600">{tag.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Price */}
        <div className="mb-3">
          <p className="text-[10px] text-gray-500 mb-0.5">From</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              US${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                US${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Buy button with animation */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm transition-colors"
        >
          Buy now in ChatGPT
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function ShopWidget() {
  const props = useWidgetProps<ShopWidgetProps>();
  const products = props?.products || [];
  const query = props?.query || "best jackets";

  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  // Force the scroll effect to rerun whenever a new carousel DOM node is mounted
  const [scrollContainerVersion, setScrollContainerVersion] = useState(0);

  const handleScrollContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (scrollContainerRef.current === node) {
      return;
    }

    scrollContainerRef.current = node;

    if (node) {
      setScrollContainerVersion((version) => version + 1);
    }
  }, []);

  const getItemsPerView = useCallback((clientWidth: number) => {
    if (isMobile) {
      return 2;
    }
    const estimated = Math.floor(clientWidth / 256);
    return Math.max(1, estimated);
  }, [isMobile]);

  // Responsive column count for grid
  const [columnCount, setColumnCount] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      if (width < 640) {
        setColumnCount(1);
      } else if (width < 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle carousel scroll with better tracking
  useEffect(() => {
    if (viewMode !== 'carousel') {
      // Reset scroll state when not in carousel mode
      setScrollProgress(0);
      setCurrentPage(0);
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      // Calculate total scrollable distance
      const maxScroll = scrollWidth - clientWidth;

      // Calculate progress (0 to 1)
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(progress);

      // Calculate current page based on visible items
      const itemsPerView = getItemsPerView(clientWidth);
      const totalPages = Math.ceil(products.length / itemsPerView);
      const newPage = Math.min(Math.floor(progress * totalPages), totalPages - 1);

      setCurrentPage(Math.max(0, newPage));
    };

    // Reset scroll position when switching to carousel
    container.scrollLeft = 0;

    container.addEventListener('scroll', handleScroll, { passive: true });

    // Trigger initial calculation immediately
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [viewMode, products.length, isMobile, scrollContainerVersion, getItemsPerView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div
      className="w-full bg-gray-50/30 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with view mode toggle */}
      <div className="px-4 sm:px-5 pt-4 pb-3 flex items-center justify-between">
        <motion.h2
          className="text-sm sm:text-base text-gray-900 font-normal"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Searched the {query}
        </motion.h2>

        {/* View mode toggle - responsive */}
        <motion.div
          className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('carousel')}
            className={clsx(
              "p-1.5 rounded transition-colors",
              viewMode === 'carousel' ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
            )}
            title="Carousel view"
          >
            <Square size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={clsx(
              "p-1.5 rounded transition-colors",
              viewMode === 'grid' ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
            )}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={clsx(
              "p-1.5 rounded transition-colors hidden sm:block",
              viewMode === 'list' ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
            )}
            title="List view"
          >
            <List size={16} />
          </motion.button>
        </motion.div>
      </div>

      {/* Products container with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="px-4 pb-5"
        >
          {viewMode === 'carousel' && (
            <div
              ref={handleScrollContainerRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} viewMode="carousel" index={index} />
              ))}
            </div>
          )}

          {viewMode === 'grid' && (
            <LayoutGroup>
              <div className={clsx(
                "grid gap-3",
                columnCount === 1 && "grid-cols-1",
                columnCount === 2 && "grid-cols-2",
                columnCount === 3 && "grid-cols-3"
              )}>
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} viewMode="grid" index={index} />
                ))}
              </div>
            </LayoutGroup>
          )}

          {viewMode === 'list' && (
            <div className="space-y-3">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} viewMode="list" index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Scroll indicator for carousel */}
      {viewMode === 'carousel' && products.length > 2 && (
        <motion.div
          className="flex justify-center gap-1.5 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {(() => {
            const container = scrollContainerRef.current;
            const indicatorItemsPerView = container
              ? getItemsPerView(container.clientWidth)
              : 1;
            const totalPages = Math.ceil(products.length / indicatorItemsPerView);
            const maxDots = Math.min(totalPages, 5); // Limit to 5 dots max

            return Array.from({ length: maxDots }).map((_, index) => {
              const isActive = currentPage === index;
              const distance = Math.abs(currentPage - index);

              return (
                <motion.button
                  key={index}
                  onClick={() => {
                    const activeContainer = scrollContainerRef.current;
                    if (activeContainer) {
                      const itemWidth = isMobile
                        ? activeContainer.clientWidth / 2
                        : 256;
                      const itemsPerView = getItemsPerView(activeContainer.clientWidth);
                      const scrollTo = index * itemWidth * itemsPerView;
                      activeContainer.scrollTo({
                        left: Math.min(
                          scrollTo,
                          activeContainer.scrollWidth - activeContainer.clientWidth
                        ),
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={clsx(
                    "rounded-full transition-all duration-300 cursor-pointer",
                    isActive
                      ? "bg-gray-700 w-6 h-1.5"
                      : distance === 1
                      ? "bg-gray-400 w-1.5 h-1.5 opacity-70"
                      : "bg-gray-300 w-1.5 h-1.5 opacity-50"
                  )}
                  whileHover={{ scale: 1.2 }}
                  animate={{
                    width: isActive ? 24 : 6,
                    opacity: isActive ? 1 : 1 - distance * 0.2
                  }}
                  transition={{ duration: 0.2 }}
                />
              );
            });
          })()}
        </motion.div>
      )}

      {/* Alternative: Progress bar for many items */}
      {viewMode === 'carousel' && products.length > 10 && (
        <div className="px-8 pb-4">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gray-600 rounded-full"
              animate={{ width: `${(scrollProgress * 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
