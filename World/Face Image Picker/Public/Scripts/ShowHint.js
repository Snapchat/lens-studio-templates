// ShowHint.js
// Version: 0.0.2
// Event: Any Event
// Description: Shows a hint to the user

// @input string hintId {"widget":"combobox","values":[{"label":"Aim camera at the sky","value":"lens_hint_aim_camera_at_the_sky"},{"label":"Blow a kiss","value":"lens_hint_blow_a_kiss"},{"label":"Blow a kiss voice changer","value":"lens_hint_blow_a_kiss_voice_changer"},{"label":"Come closer","value":"lens_hint_come_closer"},{"label":"Do not smile","value":"lens_hint_do_not_smile"},{"label":"Do not try with a friend","value":"lens_hint_do_not_try_with_a_friend"},{"label":"Draw with your finger","value":"lens_hint_draw_with_your_finger"},{"label":"Find face","value":"lens_hint_find_face"},{"label":"Find image","value":"lens_hint_find_image"},{"label":"Find marker","value":"lens_hint_find_marker"},{"label":"Find snapcode","value":"lens_hint_find_snapcode"},{"label":"Kiss","value":"lens_hint_kiss"},{"label":"Kiss again","value":"lens_hint_kiss_again"},{"label":"Look around","value":"lens_hint_look_around"},{"label":"Look down","value":"lens_hint_look_down"},{"label":"Look left","value":"lens_hint_look_left"},{"label":"Look right","value":"lens_hint_look_right"},{"label":"Look up","value":"lens_hint_look_up"},{"label":"Make some noise!","value":"lens_hint_make_some_noise"},{"label":"Move your head","value":"lens_hint_move_your_head"},{"label":"Nod your head","value":"lens_hint_nod_your_head"},{"label":"Now kiss","value":"lens_hint_now_kiss"},{"label":"Now open your mouth","value":"lens_hint_now_open_your_mouth"},{"label":"Now raise your eyebrows","value":"lens_hint_now_raise_your_eyebrows"},{"label":"Now smile","value":"lens_hint_now_smile"},{"label":"Open your mouth","value":"lens_hint_open_your_mouth"},{"label":"Open your mouth again","value":"lens_hint_open_your_mouth_again"},{"label":"Open your mouth voice changer","value":"lens_hint_open_your_mouth_voice_changer"},{"label":"Pick a face","value":"lens_hint_pick_a_face"},{"label":"Pick a photo","value":"lens_hint_pick_a_photo"},{"label":"Pick an image","value":"lens_hint_pick_an_image"},{"label":"Raise your eyebrows","value":"lens_hint_raise_your_eyebrows"},{"label":"Raise your eyebrows again","value":"lens_hint_raise_your_eyebrows_again"},{"label":"Raise your eyebrows or open your mouth","value":"lens_hint_raise_eyebrows_or_open_mouth"},{"label":"Raise your eyebrows voice changer","value":"lens_hint_raise_your_eyebrows_voice_changer"},{"label":"Rotate your phone","value":"lens_hint_rotate_your_phone"},{"label":"Say something","value":"lens_hint_say_something"},{"label":"Smile","value":"lens_hint_smile"},{"label":"Smile again","value":"lens_hint_smile_again"},{"label":"Smile voice changer","value":"lens_hint_smile_voice_changer"},{"label":"Swap camera","value":"lens_hint_swap_camera"},{"label":"Tap a surface","value":"lens_hint_tap_a_surface"},{"label":"Tap ground to place","value":"lens_hint_tap_ground_to_place"},{"label":"Tap surface to place","value":"lens_hint_tap_surface_to_place"},{"label":"Tap the ground","value":"lens_hint_tap_ground"},{"label":"Tap!","value":"lens_hint_tap"},{"label":"Tilt your head","value":"lens_hint_tilt_your_head"},{"label":"Try it with a friend","value":"lens_hint_try_friend"},{"label":"Try it with your rear camera","value":"lens_hint_try_rear_camera"},{"label":"Turn around","value":"lens_hint_turn_around"},{"label":"Voice changer","value":"lens_hint_voice_changer"},{"label":"Walk through the door","value":"lens_hint_walk_through_the_door"}]}
// @input float showTime = 2.0 {"label": "Show Time"}
// @input float delayTime {"label": "Delay Time"}
// @input bool showOnce = true {"label": "Show Once"}

// Initialize hints
if( !script.initialized ) {

    // Create the hint component
    script.hintComponent = script.getSceneObject().createComponent( "Component.HintsComponent" );

    // Initialize done
    script.hintShown = false;
    script.initialized = true;
}

// Show the hint
showHint();

function showHint() {

    // Only show hint if it hasn't been shown, if allowing multiple times
    if( !script.hintShown || !script.showOnce ) {

        // Create a delayed callback to show the hint
        var delayEvent = script.createEvent( "DelayedCallbackEvent" );
        delayEvent.bind(function(eventData) {

            print( "Showing Hint: " + script.hintId );
            script.hintComponent.showHint(script.hintId, script.showTime);

        })
        delayEvent.reset(script.delayTime);

        // Mark hint as shown
        script.hintShown = true;
    }

}
