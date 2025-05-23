
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/contexts/AuthContext";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export function MainNavigation() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-accent text-white py-3">
      <div className="container px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img 
            src="/lovable-uploads/ef0c0ba4-8c77-4009-8669-dec94b2ec9de.png" 
            alt="Allegrow" 
            className="h-10"
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden flex items-center text-white"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              {/* About */}
              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white bg-transparent hover:bg-white/20")}>
                    {t("nav.about")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Blog */}
              <NavigationMenuItem>
                <Link to="/blog">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white bg-transparent hover:bg-white/20")}>
                    {t("nav.blog")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* How It Works */}
              <NavigationMenuItem>
                <Link to="/how-it-works">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white bg-transparent hover:bg-white/20")}>
                    {t("nav.howItWorks")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* For Partners */}
              <NavigationMenuItem>
                <Link to="/partners">
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white bg-transparent hover:bg-white/20")}>
                    {t("nav.forPartners")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Language Selector */}
          <LanguageSelector />

          {/* Auth Buttons */}
          {user ? (
            <Button asChild variant="outline" className="text-white border-white hover:bg-white/20">
              <Link to="/profile">{t("nav.myProfile")}</Link>
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" className="text-white hover:bg-white/20">
                <Link to="/login">{t("nav.login").split(" / ")[0]}</Link>
              </Button>
              <Button asChild variant="secondary" className="hover:bg-secondary/80">
                <Link to="/signup">{t("nav.login").split(" / ")[1]}</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-accent z-50 md:hidden p-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/about" 
                className="text-white px-4 py-2 rounded hover:bg-white/20"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.about")}
              </Link>
              <Link 
                to="/blog" 
                className="text-white px-4 py-2 rounded hover:bg-white/20"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.blog")}
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-white px-4 py-2 rounded hover:bg-white/20"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.howItWorks")}
              </Link>
              <Link 
                to="/partners" 
                className="text-white px-4 py-2 rounded hover:bg-white/20"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.forPartners")}
              </Link>

              <div className="pt-2 border-t border-white/20">
                {user ? (
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full text-white border-white hover:bg-white/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/profile">{t("nav.myProfile")}</Link>
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="w-full text-white hover:bg-white/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link to="/login">{t("nav.login").split(" / ")[0]}</Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link to="/signup">{t("nav.login").split(" / ")[1]}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
