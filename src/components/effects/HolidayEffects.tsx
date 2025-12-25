import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SnowEffect from "./SnowEffect";
import HeartsEffect from "./HeartsEffect";
import ConfettiEffect from "./ConfettiEffect";
import ChristmasLights from "./ChristmasLights";

export type HolidayMode = 'none' | 'christmas' | 'valentines' | 'new_year';

const HolidayEffects = () => {
    const [mode, setMode] = useState<HolidayMode>('none');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('admin_settings')
                    .select('holiday_mode')
                    .limit(1)
                    .maybeSingle();

                if (error) {
                    console.warn("Failed to fetch holiday settings (Table might not exist yet):", error.message);
                    return;
                }

                if (data) {
                    setMode(data.holiday_mode as HolidayMode);
                }
            } catch (err) {
                console.warn("Error fetching holiday settings:", err);
            }
        };

        fetchSettings();

        // Subscribe to changes
        const channel = supabase
            .channel('admin_settings_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'admin_settings'
                },
                (payload) => {
                    if (payload.new && (payload.new as any).holiday_mode) {
                        setMode((payload.new as any).holiday_mode as HolidayMode);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (mode === 'none') return null;

    return (
        <>
            {mode === 'christmas' && (
                <>
                    <ChristmasLights />
                    <SnowEffect />
                </>
            )}
            {mode === 'valentines' && <HeartsEffect />}
            {mode === 'new_year' && <ConfettiEffect />}
        </>
    );
};

export default HolidayEffects;
