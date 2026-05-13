import { useEffect, useRef, useState, useCallback } from "react";

let scriptLoaded = false;
let scriptLoading = false;
const callbacks = [];

function loadGoogleMapsScript(key) {
  return new Promise((resolve) => {
    if (scriptLoaded && window.google?.maps?.places) { resolve(); return; }
    callbacks.push(resolve);
    if (scriptLoading) return;
    scriptLoading = true;
    window.__googleMapsInit = () => {
      scriptLoaded = true;
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=__googleMapsInit`;
    script.async = true;
    script.defer = true;
    script.onerror = () => { scriptLoading = false; callbacks.forEach(cb => cb()); callbacks.length = 0; };
    document.head.appendChild(script);
  });
}

export function useGooglePlacesAutocomplete() {
  const inputRef = useRef(null);
  const serviceRef = useRef(null);
  const debounceRef = useRef(null);
  const [place, setPlace] = useState({ address: "", lat: null, lng: null });
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) return;
    loadGoogleMapsScript(key).then(() => {
      if (window.google?.maps?.places) {
        serviceRef.current = new window.google.maps.places.AutocompleteService();
        setReady(true);
      }
    });
  }, []);

  const fetchSuggestions = useCallback((value) => {
    if (!value || value.length < 2 || !serviceRef.current) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    serviceRef.current.getPlacePredictions(
      { input: value, types: ["(cities)"], componentRestrictions: { country: "in" } },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.map(p => ({
            placeId: p.place_id,
            main: p.structured_formatting.main_text,
            secondary: p.structured_formatting.secondary_text,
          })));
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      }
    );
  }, []);

  const handleInput = useCallback((value) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 250);
  }, [fetchSuggestions]);

  const selectSuggestion = useCallback((suggestion) => {
    setPlace({ address: suggestion.main, lat: null, lng: null });
    setSuggestions([]);
    setShowDropdown(false);
    if (inputRef.current) inputRef.current.value = suggestion.main;
  }, []);

  const clearPlace = useCallback(() => {
    setPlace({ address: "", lat: null, lng: null });
    setSuggestions([]);
    setShowDropdown(false);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const closeDropdown = useCallback(() => {
    setSuggestions([]);
    setShowDropdown(false);
  }, []);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return { inputRef, place, suggestions, showDropdown, handleInput, selectSuggestion, clearPlace, closeDropdown };
}
