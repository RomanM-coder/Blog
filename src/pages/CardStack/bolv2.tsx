<AnimatePresence mode="wait">
  {isOpenHamburger && (
    <motion.div
      key="mobileMenu"
      className={styles.mobileMenu}
      initial="closed"
      animate="open"
      exit="closed"
      variants={/* ваши variants для меню */}
    >
      <ul>
        {/* ... другие пункты меню ... */}
        
        <li>
          <motion.div
            onClick={(event) => toggleDropdownParent(event, 1)}
            whileTap={{ scale: 0.95 }}
          >
            Posts
          </motion.div>

          {/* Подменю с AnimatePresence */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={styles.postDropdown}
                key="postDropdown"
                initial="dropdownClosed"
                animate="dropdownOpen"
                exit="dropdownClosed"
                variants={{
                  dropdownOpen: {
                    opacity: 1,
                    clipPath: "inset(0% 0% 0% 0% round 8px)",
                    transition: { /* ваши параметры */ }
                  },
                  dropdownClosed: {
                    opacity: 0,
                    clipPath: "inset(10% 50% 90% 50% round 8px)",
                    transition: { /* ваши параметры */ }
                  }
                }}
              >
                <ul>
                  {categoryList.map((category) => (
                    <motion.li
                      key={`${category._id}`}
                      variants={{
                        open: {
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: { type: "spring" }
                        },
                        closed: {
                          opacity: 0,
                          scale: 0.3,
                          filter: "blur(20px)",
                          transition: { duration: 0.2 }
                        }
                      }}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <NavLink to={`/posts/${category._id}`}>
                        {category.name}
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      </ul>
    </motion.div>
  )}
</AnimatePresence>


const ulVariants: Variants = {
    open: {
      opacity: 1,
      x: 0,
      // clipPath: "inset(0% 0% 0% 0% round 10px)",                          
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      // clipPath: "inset(10% 50% 90% 50% round 10px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3,
        when: "afterChildren",
        staggerDirection: -1,
        staggerChildren: 0.06
      }
    }
  }

  const ulVariants2: Variants = {
    dropdownOpen: {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0% round 8px)",                    
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    },
    dropdownClose: {
      opacity: 0,
      clipPath: "inset(10% 50% 90% 50% round 8px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3,
        when: "afterChildren",
        staggerDirection: -1,
        staggerChildren: 0.06
      }
    }
  }

  const itemVariant: Variants = {
     open: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      color: activePage === index ? 'rgb(255, 0, 0)' : '#fff',
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: {
      opacity: 0,
      scale: 0.3,
      filter: "blur(20px)",
      color: 'rgb(255, 255, 255)',   
      transition: { duration: 0.2, when: "afterChildren" }      
    }
  }

  const itemVariants2: Variants = {
    dropdownChildOpen: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 300, damping: 24 }
      //transition: {stiffness: 300, damping: 24, duration: 0.3}
    },
    dropdownChildClose: {
      opacity: 0,
      scale: 0.3,
      filter: "blur(20px)",
      transition: { duration: 0.2 }
    }
  }